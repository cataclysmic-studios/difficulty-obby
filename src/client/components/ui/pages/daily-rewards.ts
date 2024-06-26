import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "client/hooks";
import { Events, Functions } from "client/network";
import { PlayerGui } from "shared/utility/client";
import { CrateName, type DailyReward, DailyRewardType } from "shared/structs/player-items";
import { DAILY_REWARDS } from "shared/constants";

const { clamp } = math;

@Component({
  tag: "DailyRewardsPage",
  ancestorWhitelist: [PlayerGui]
})
export class DailyRewardsPage extends BaseComponent<{}, PlayerGui["Main"]["DailyRewards"]> implements OnStart, OnDataUpdate {
  private readonly updateJanitor = new Janitor;

  private lastStreak?: number

  public onStart(): void {
    this.instance.GetPropertyChangedSignal("Visible").Connect(() => {
      if (!this.instance.Visible) return;
      Events.data.updateLoginStreak();
    });
  }

  public async onDataUpdate(directory: string, loginStreak: number): Promise<void> {
    const list = this.instance.List;
    type DayButton = typeof list.Day1;
    if (!endsWith(directory, "loginStreak")) return;
    if (loginStreak === this.lastStreak) return;

    const dailyRewardsButton = PlayerGui.Main.Main.LeftButtons.DailyRewards;
    dailyRewardsButton.Notification.Visible = false;

    this.updateJanitor.Cleanup();
    const day = clamp(loginStreak + 1, 1, 7);
    const reward = DAILY_REWARDS[day - 1];
    const buttons = list.GetChildren().filter((i): i is DayButton => i.IsA("TextButton"));
    buttons.push(<DayButton>list.NoGrid.Day7);

    const alreadyClaimed = <boolean>await Functions.data.get("claimedDaily", false);
    const dayName = `Day${day}`;
    const dayButton = <DayButton>(day === 7 ? list.NoGrid.Day7 : list.WaitForChild(dayName));
    for (const button of buttons) {
      button.GrayedOut.Visible = button.Name !== dayButton.Name && button.LayoutOrder > day
      button.Claimed.Visible = button.LayoutOrder === day ? alreadyClaimed : button.LayoutOrder < day;
    }

    this.lastStreak = loginStreak;
    if (alreadyClaimed) {
      dayButton.Claimed.Visible = true;
      return;
    }

    dailyRewardsButton.Notification.Visible = true;
    dailyRewardsButton.MouseButton1Click.Once(() => dailyRewardsButton.Notification.Visible = false);
    this.updateJanitor.Add(dayButton.MouseButton1Click.Connect(() => {
      this.updateJanitor.Cleanup();

      Events.data.set("claimedDaily", true);
      dayButton.Claimed.Visible = true;
      if ((<unknown[]>reward)[0] !== undefined) // it's an array
        for (const item of <DailyReward[]>reward)
          this.giveReward(item);
      else
        this.giveReward(<DailyReward>reward);
    }));
  }

  private async giveReward(reward: DailyReward): Promise<void> {
    switch (reward.type) {
      case DailyRewardType.Coins:
        return Events.data.increment("coins", <number>reward.value);
      case DailyRewardType.Skip:
        return Events.data.increment("skipCredits", <number>reward.value);
      case DailyRewardType.Crate:
        return Events.data.addToArray("ownedCrates", <CrateName>reward.value);
      case DailyRewardType.Booster: {
        const [amount, name] = <[number, string]>reward.value;
        let boosters: string[] = [];
        for (const _ of $range(1, amount))
          boosters.push(name);

        const ownedBoosters = <string[]>await Functions.data.get("ownedBoosters", []);
        return Events.data.set("ownedBoosters", [...ownedBoosters, ...boosters]);
      }
    }
  }
}