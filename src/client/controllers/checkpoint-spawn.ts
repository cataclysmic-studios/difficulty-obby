import { Controller, type OnInit } from "@flamework/core";
import { CollectionService } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import type { LogStart } from "shared/hooks";
import { Events } from "client/network";
import Log from "shared/logger";

import type { CharacterController } from "./character";

@Controller({ loadOrder: 0 })
export class CheckpointSpawnController implements OnInit, LogStart {
  public constructor(
    private readonly character: CharacterController
  ) { }

  public onInit(): void {
    const conn = Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "stage")) return;
      if (value === 0)
        return conn.Disconnect();

      const character = this.character.get();
      if (character === undefined || character.Humanoid === undefined) return;
      if (character.Humanoid.RootPart === undefined) return;

      conn.Disconnect();
      const checkpoints = <SpawnLocation[]>CollectionService.GetTagged("Checkpoint");
      const checkpoint = checkpoints.find(checkpoint => checkpoint.Name === tostring(value));
      if (checkpoint === undefined)
        return Log.warning(`Failed to find checkpoint ${value}`);

      character.Humanoid.RootPart.CFrame = checkpoint.CFrame.add(new Vector3(0, 6, 0));
    });
  }
}