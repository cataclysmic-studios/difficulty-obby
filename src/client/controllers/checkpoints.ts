import { Controller, type OnInit } from "@flamework/core";
import { Workspace as World, MarketplaceService as Market } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import type { OnDataUpdate } from "client/hooks";
import { Events } from "client/network";
import { Player } from "shared/utility/client";
import { TOTAL_STAGE_COUNT } from "shared/zones";
import Log from "shared/logger";

import type { CharacterController } from "./character";
import type { NotificationController } from "./notification";
import type { UIEffectsController } from "./ui-effects";

const { clamp } = math;

const STAGE_ARROW_COOLDOWN = 0.1;

@Controller({ loadOrder: 2 })
export class CheckpointsController implements OnInit, OnDataUpdate, LogStart {
  public readonly offsetUpdated = new Signal<(newStage: number) => void>;
  public readonly inLobbyUpdated = new Signal<(inLobby: boolean) => void>;
  public inLobby = true;
  public stage = 0;

  private stageOffset = 0;
  private offsetDebounce = false;
  private firstStageTry = true;
  private firstStageUpdate = true;

  public constructor(
    private readonly character: CharacterController,
    private readonly notification: NotificationController,
    private readonly uiEffects: UIEffectsController
  ) { }

  public onInit(): void {
    Events.character.respawn.connect(promptSkip => this.respawn(promptSkip));
    Events.advanceStageOffset.connect(() => this.addStageOffset(1, true));
    this.updateInLobby();
  }

  public onDataUpdate(directory: string, stage: number): void {
    if (!endsWith(directory, "stage")) return;
    this.stage = stage;
    this.stageOffset = 0;
    this.firstStageTry = true;
    this.update(true);

    if (this.firstStageUpdate && stage !== 0) {
      this.inLobby = false;
      this.updateInLobby();
      this.respawn(false);
      this.firstStageUpdate = false;
    }
  }

  public addStageOffset(offset = 1, advancing = false): void {
    if (this.offsetDebounce) return
    this.offsetDebounce = true;
    task.delay(STAGE_ARROW_COOLDOWN, () => this.offsetDebounce = false);

    if (this.getStage() + offset > this.stage) return;
    this.stageOffset += offset;
    this.update(advancing);
  }

  public subtractStageOffset(offset = 1): void {
    if (this.offsetDebounce) return
    this.offsetDebounce = true;
    task.delay(STAGE_ARROW_COOLDOWN, () => this.offsetDebounce = false);

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
    return clamp(this.stage + this.stageOffset, 0, TOTAL_STAGE_COUNT + 1);
  }

  public updateInLobby(): void {
    this.inLobbyUpdated.Fire(this.inLobby);
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