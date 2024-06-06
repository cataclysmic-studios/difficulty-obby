import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import { getZone } from "shared/zones";

import type { CheckpointsController } from "./checkpoints";
import type { NotificationController } from "./notification";

@Controller({ loadOrder: 1 })
export class ZonesController implements OnInit, LogStart {
  public readonly discovered = new Signal<(zoneName: string, currentStage: number) => void>;
  public readonly changed = new Signal<(zoneName: string, currentStage: number) => void>;
  public lastZoneName?: string;

  public constructor(
    private readonly checkpoints: CheckpointsController,
    private readonly notification: NotificationController,
  ) { }

  public onInit(): void {
    this.checkpoints.offsetUpdated.Connect(stage => {
      const { name: zoneName, stageCount } = getZone(stage);
      if (zoneName === this.lastZoneName) return;

      this.lastZoneName = zoneName;
      this.changed.Fire(zoneName, stage);
      if (math.max(stage - 1, 0) % stageCount !== 0) return;
      this.discover(zoneName, stage);
    });
  }

  public fireChange(): void {
    const stage = this.checkpoints.getStage();
    const { name: zoneName } = getZone(stage);
    this.changed.Fire(zoneName, stage);
  }

  private discover(name: string, stage: number): void {
    if (this.checkpoints.stage > stage) return;
    Sound.SoundEffects.ZoneDiscovered.Play();
    this.notification.send(`New zone discovered: ${name}`);
    this.discovered.Fire(name, stage);
  }
}