import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "client/hooks";
import type { LogStart } from "shared/hooks";
import { Player, PlayerGui } from "shared/utility/client";
import { CheckpointsController } from "client/controllers/checkpoints";

interface StageInfoFrame extends Frame {
  StageNumber: TextLabel;
  NextStage: TextButton;
  PreviousStage: TextButton;
  Next10Stages: TextButton;
  Previous10Stages: TextButton;
  Skip: ImageButton;
}

@Component({
  tag: "StageInfo",
  ancestorWhitelist: [PlayerGui]
})
export class StageInfo extends BaseComponent<{}, StageInfoFrame> implements OnStart, OnDataUpdate, LogStart {
  private stage = 0;

  public constructor(
    private readonly checkpoints: CheckpointsController
  ) { super(); }

  public onStart(): void {
    this.instance.Skip.MouseButton1Click.Connect(() => Market.PromptProductPurchase(Player, 1814214080));
    this.instance.NextStage.MouseButton1Click.Connect(() => {
      this.checkpoints.addStageOffset();
      this.onDataUpdate("stage", this.stage);
    });
    this.instance.PreviousStage.MouseButton1Click.Connect(() => {
      this.checkpoints.subtractStageOffset();
      this.onDataUpdate("stage", this.stage);
    });
    this.instance.Next10Stages.MouseButton1Click.Connect(() => {
      this.checkpoints.addStageOffset(10)
      this.onDataUpdate("stage", this.stage);
    });
    this.instance.Previous10Stages.MouseButton1Click.Connect(() => {
      this.checkpoints.subtractStageOffset(10)
      this.onDataUpdate("stage", this.stage);
    });
  }

  public onDataUpdate(directory: string, stage: number): void {
    if (!endsWith(directory, "stage")) return;
    this.stage = stage;
    this.instance.StageNumber.Text = tostring(this.stage + this.checkpoints.getStageOffset());
    this.instance.Visible = true;
  }
}