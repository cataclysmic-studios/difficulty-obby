import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utility/client";
import { Events } from "client/network";

const INTERVAL = 30 * 60; // 30 minutes

@Component({
  tag: "BoosterNote",
  ancestorWhitelist: [PlayerGui]
})
export class BoosterNote extends BaseComponent<{}, TextLabel> implements OnStart {
  public onStart(): void {
    task.spawn(() => {
      let secondsUntil = INTERVAL;
      do {
        const minutesUntil = math.floor(secondsUntil / 60);
        const lastMinute = minutesUntil === 0;
        this.instance.Text = `Play ${lastMinute ? secondsUntil : minutesUntil} more ${lastMinute ? "seconds" : "minutes"} for a free booster!`;
        secondsUntil -= 1;
        if (secondsUntil <= 0) {
          Events.data.rewardBooster();
          secondsUntil = INTERVAL
        }
      } while (task.wait(1));
    });
  }
}