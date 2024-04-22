import { Controller, type OnInit } from "@flamework/core";
import { Workspace as World } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import type { LogStart } from "shared/hooks";
import { Events } from "client/network";
import { STAGES_PER_ZONE, ZONE_INFO } from "shared/constants";
import Log from "shared/logger";

import type { CharacterController } from "./character";

const { clamp } = math;

@Controller({ loadOrder: 0 })
export class CheckpointsController implements OnInit, LogStart {
  private stage = 0;
  private stageOffset = 0;

  public constructor(
    private readonly character: CharacterController
  ) { }

  public onInit(): void {
    let firstTime = true;
    Events.respawnCharacter.connect(() => this.respawn());
    Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "stage")) return;
      this.stage = <number>value;

      if (firstTime) {
        this.respawn();
        firstTime = false;
      }
    });
  }

  public addStageOffset(offset = 1): void {
    this.stageOffset += offset;
    this.respawn();
  }

  public subtractStageOffset(offset = 1): void {
    this.stageOffset -= offset;
    this.respawn();
  }

  public getStageOffset(): number {
    return this.stageOffset;
  }

  public getStage(): number {
    return clamp(this.stage + this.stageOffset, 0, ZONE_INFO.size() * STAGES_PER_ZONE);
  }

  private respawn(): void {
    const spawn = World.GetDescendants()
      .filter((i): i is SpawnLocation => i.IsA("SpawnLocation"))
      .find(spawn => spawn.Name === tostring(this.stage + this.stageOffset));

    if (spawn === undefined)
      return Log.warning(`Failed to find spawn for stage ${this.stage}`);

    const root = this.character.getRoot();
    if (root === undefined) return;
    root.CFrame = spawn.CFrame.add(new Vector3(0, 6, 0));
  }
}