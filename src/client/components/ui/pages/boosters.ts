import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "client/hooks";
import { Events, Functions } from "client/network";
import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { BOOSTERS } from "shared/constants";
import type { Booster } from "shared/structs/player-items";

import type { NotificationController } from "client/controllers/notification";

@Component({
  tag: "BoostersPage",
  ancestorWhitelist: [PlayerGui]
})
export class BoostersPage extends BaseComponent<{}, PlayerGui["Main"]["Boosters"]> implements OnDataUpdate {
  private readonly updateJanitor = new Janitor;

  public constructor(
    private readonly notification: NotificationController
  ) { super(); }

  public onDataUpdate(directory: string, boosterNames: string[]): void {
    if (!endsWith(directory, "ownedBoosters")) return;

    this.updateJanitor.Cleanup();
    for (const frame of this.instance.List.GetChildren().filter((i): i is Frame => i.IsA("Frame")))
      frame.Destroy();

    const boosters = boosterNames.mapFiltered(boosterName => BOOSTERS.find(booster => booster.name === boosterName));
    for (const booster of boosters)
      task.spawn(() => this.updateJanitor.Add(this.createBoosterFrame(booster)));
  }

  private createBoosterFrame({ name, icon, length }: Booster): RBXScriptConnection {
    let debounce = false;
    const consumableFrame = Assets.UI.Consumable.Clone();
    consumableFrame.Title.Text = name;
    consumableFrame.Length.Text = length;
    consumableFrame.Icon.Image = icon;
    const conn = consumableFrame.Use.MouseButton1Click.Connect(async () => {
      if (debounce) return;
      debounce = true;
      task.delay(0.2, () => debounce = false);

      const isActive = await Functions.isBoosterActive(name);
      if (isActive)
        return this.notification.send(`${name} booster is already active.`);

      consumableFrame.Destroy();
      Events.data.useBooster(name);
    });
    consumableFrame.Parent = this.instance.List;
    return conn;
  }
}