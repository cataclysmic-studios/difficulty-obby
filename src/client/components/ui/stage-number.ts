import { Component, BaseComponent } from "@flamework/components";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "client/hooks";
import type { LogStart } from "shared/hooks";
import { PlayerGui } from "shared/utility/client";

@Component({
  tag: "StageNumber",
  ancestorWhitelist: [PlayerGui]
})
export class StageNumber extends BaseComponent<{}, TextLabel> implements OnDataUpdate, LogStart {
  public onDataUpdate(directory: string, stage: number): void {
    if (!endsWith(directory, "stage")) return;
    this.instance.Text = tostring(stage);
  }
}