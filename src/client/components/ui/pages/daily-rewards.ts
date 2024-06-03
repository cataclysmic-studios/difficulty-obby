import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utility/client";

@Component({
  tag: "DailyRewardsPage",
  ancestorWhitelist: [PlayerGui]
})
export class DailyRewardsPage extends BaseComponent<{}, PlayerGui["Main"]["DailyRewards"]> implements OnStart {
  public onStart(): void {

  }
}