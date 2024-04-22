import { Controller, type OnInit } from "@flamework/core";
import { Workspace as World } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import type { LogStart } from "shared/hooks";
import { Events } from "client/network";
import { STAGES_PER_ZONE, ZONE_INFO } from "shared/constants";
import Log from "shared/logger";

import type { CharacterController } from "./character";

const { max, clamp } = math;

@Controller({ loadOrder: 0 })
export class CheckpointsController implements OnInit, LogStart {
  private stage = 0;
  private stageOffset = 0;
  private firstTry = true;

  public constructor(
    private readonly character: CharacterController
  ) { }

  public onInit(): void {
    let firstTime = true;
    Events.respawnCharacter.connect(() => this.respawn());
    Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "stage")) return;
      this.stage = <number>value;
      this.firstTry = true;

      if (firstTime) {
        this.respawn(false);
        firstTime = false;
      }
    });
  }

  public addStageOffset(offset = 1): void {
    if (this.getStage() + offset > this.stage) return;
    this.stageOffset += offset;
    this.respawn(false);
  }

  public subtractStageOffset(offset = 1): void {
    if (this.getStage() - offset < 0) return;
    this.stageOffset -= offset;
    this.respawn(false);
  }

  public getStageOffset(): number {
    return this.stageOffset;
  }

  public getStage(): number {
    return clamp(this.stage + this.stageOffset, 0, ZONE_INFO.size() * STAGES_PER_ZONE);
  }

  private respawn(promptSkip = true): void {
    const spawn = World.GetDescendants()
      .filter((i): i is SpawnLocation => i.IsA("SpawnLocation"))
      .find(spawn => spawn.Name === tostring(this.stage + this.stageOffset));

    if (spawn === undefined)
      return Log.warning(`Failed to find spawn for stage ${this.stage}`);

    const root = this.character.getRoot();
    if (root === undefined) return;
    if (promptSkip && !this.firstTry) {
      this.firstTry = false;
      this.promptSkip();
    }

    if (promptSkip && this.firstTry)
      this.firstTry = false;

    root.CFrame = spawn.CFrame.add(new Vector3(0, 6, 0));
  }

  private promptSkip(): void {
    print("buy da skip stage product!!!!!11");
  }
}