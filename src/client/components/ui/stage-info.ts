import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "client/hooks";
import type { LogStart } from "shared/hooks";
import { Events, Functions } from "client/network";
import { Player, PlayerGui } from "shared/utility/client";
import { getZoneName, STAGES_PER_ZONE, ZONE_NAMES } from "shared/zones";
import { ProductIDs } from "shared/structs/product-ids";
import type { PlayerData } from "shared/data-models/player-data";

import type { CheckpointsController } from "client/controllers/checkpoints";

interface StageInfoFrame extends Frame {
  StageNumber: TextLabel;
  ZoneName: TextLabel;
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
  public constructor(
    private readonly checkpoints: CheckpointsController
  ) { super(); }

  public onStart(): void {
    this.checkpoints.offsetUpdated.Connect(stage => this.onDataUpdate("stage", stage - this.checkpoints.getStageOffset()));

    this.instance.NextStage.MouseButton1Click.Connect(() => this.checkpoints.addStageOffset());
    this.instance.PreviousStage.MouseButton1Click.Connect(() => this.checkpoints.subtractStageOffset())
    this.instance.Next10Stages.MouseButton1Click.Connect(() => this.checkpoints.addStageOffset(10));
    this.instance.Previous10Stages.MouseButton1Click.Connect(() => this.checkpoints.subtractStageOffset(10));
    this.instance.Skip.MouseButton1Click.Connect(async () => {
      const data = <PlayerData>await Functions.data.get();
      if (data.stage >= ((ZONE_NAMES.size() - 1) * STAGES_PER_ZONE) + 1) return; // if we're on max stage don't allow skip
      if (data.skipCredits > 0)
        Events.data.useSkipCredit();
      else
        Market.PromptProductPurchase(Player, ProductIDs.SkipStage);
    });
  }

  public onDataUpdate(directory: string, stage: number): void {
    if (!endsWith(directory, "stage")) return;
    stage = math.max(stage + this.checkpoints.getStageOffset(), 0);
    this.instance.StageNumber.Text = tostring(stage);
    this.instance.ZoneName.Text = getZoneName(stage);
    this.instance.Visible = true;
  }
}