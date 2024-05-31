import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import { getZoneName, STAGES_PER_ZONE } from "shared/zones";

import type { CheckpointsController } from "./checkpoints";
import type { NotificationController } from "./notification";

@Controller({ loadOrder: 1 })
export class ZonesController implements OnInit, LogStart {
  public readonly discovered = new Signal<(zoneName: string, currentStage: number) => void>;
  public readonly changed = new Signal<(zoneName: string, currentStage: number) => void>;

  private lastZoneName?: string;

  public constructor(
    private readonly checkpoints: CheckpointsController,
    private readonly notification: NotificationController,
  ) { }

  public onInit(): void {
    this.checkpoints.offsetUpdated.Connect(stage => {
      const zoneName = getZoneName(stage);
      if (zoneName === this.lastZoneName) return;

      this.lastZoneName = zoneName;
      this.changed.Fire(zoneName, stage);
      if (math.max(stage - 1, 0) % STAGES_PER_ZONE !== 0) return;
      this.discover(zoneName, stage);
    });
  }

  private discover(name: string, stage: number): void {
    if (this.checkpoints.stage > stage) return;
    Sound.SoundEffects.ZoneDiscovered.Play();
    this.notification.send(`New zone discovered: ${name}`);
    this.discovered.Fire(name, stage);
  }
}