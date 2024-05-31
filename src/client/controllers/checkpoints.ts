import { Controller, OnStart, type OnInit } from "@flamework/core";
import { Workspace as World, MarketplaceService as Market } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import { Events } from "client/network";
import { Player } from "shared/utility/client";
import { STAGES_PER_ZONE, ZONE_NAMES } from "shared/zones";
import Log from "shared/logger";

import type { CharacterController } from "./character";
import type { NotificationController } from "./notification";
import type { UIEffectsController } from "./ui-effects";

const { clamp } = math;

@Controller({ loadOrder: 0 })
export class CheckpointsController implements OnInit, OnStart, LogStart {
  public readonly offsetUpdated = new Signal<(newStage: number) => void>;
  public stage = 0;

  private stageOffset = 0;
  private offsetDebounce = false;
  private firstStageTry = true;

  public constructor(
    private readonly character: CharacterController,
    private readonly notification: NotificationController,
    private readonly uiEffects: UIEffectsController
  ) { }

  public onInit(): void {
    let firstStageUpdate = true;

    Events.character.respawn.connect(promptSkip => this.respawn(promptSkip));
    Events.advanceStageOffset.connect(() => this.addStageOffset(1, true));
    Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "stage")) return;
      this.stage = <number>value;
      this.stageOffset = 0;
      this.firstStageTry = true;
      this.update(true);

      if (firstStageUpdate) {
        this.respawn(false);
        firstStageUpdate = false;
      }
    });
  }

  public onStart(): void {
    this.update();
    task.delay(3, () => this.update());
  }

  public addStageOffset(offset = 1, advancing = false): void {
    if (this.offsetDebounce) return
    this.offsetDebounce = true;
    task.delay(0.35, () => this.offsetDebounce = false);

    if (this.getStage() + offset > this.stage) return;
    this.stageOffset += offset;
    this.update(advancing);
  }

  public subtractStageOffset(offset = 1): void {
    if (this.offsetDebounce) return
    this.offsetDebounce = true;
    task.delay(0.35, () => this.offsetDebounce = false);

    if (this.getStage() - offset < 0) return;
    this.stageOffset -= offset;
    this.update();
  }

  public respawn(promptSkip = true): void {
    const spawns = this.getAllSpawns();
    const spawn = spawns.find(spawn => spawn.Name === tostring(this.stage + this.stageOffset));
    if (spawn === undefined)
      return Log.warning(`Failed to find spawn for stage ${this.stage + this.stageOffset}`);

    const root = this.character.getRoot();
    if (root === undefined) return;

    this.uiEffects.flash();
    if (promptSkip && !this.firstStageTry) {
      this.firstStageTry = false;
      this.promptSkip();
    }

    if (promptSkip && this.firstStageTry)
      this.firstStageTry = false;

    root.CFrame = spawn.CFrame.add(new Vector3(0, 6, 0));
  }

  public getStageOffset(): number {
    return this.stageOffset;
  }

  public getStage(): number {
    return clamp(this.stage + this.stageOffset, 0, ZONE_NAMES.size() * STAGES_PER_ZONE + 1);
  }

  private update(advancing = false): void {
    this.offsetUpdated.Fire(this.getStage());
    Events.stageOffsetUpdated(this.getStage(), advancing);
  }

  private getAllSpawns(): SpawnLocation[] {
    return World.GetDescendants().filter((i): i is SpawnLocation => i.IsA("SpawnLocation"));
  }

  private promptSkip(): void {
    this.notification.send("Want to skip this stage? Click here!", () => Market.PromptProductPurchase(Player, 1814214080));
  }
}