import { Controller, type OnInit } from "@flamework/core";
import { CollectionService } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import type { LogStart } from "shared/hooks";
import { Events } from "client/network";
import { Character } from "shared/utility/client";
import Log from "shared/logger";

@Controller({ loadOrder: 1 })
export class CheckpointSpawnController implements OnInit, LogStart {
  public onInit(): void {
    const conn = Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "stage")) return;
      if (value === 0)
        return conn.Disconnect();

      if (Character === undefined || Character.Humanoid === undefined) return;
      if (Character.Humanoid.RootPart === undefined) return;

      conn.Disconnect();
      const checkpoints = <SpawnLocation[]>CollectionService.GetTagged("Checkpoint");
      const checkpoint = checkpoints.find(checkpoint => checkpoint.Name === tostring(value));
      if (checkpoint === undefined)
        return Log.warning(`Failed to find checkpoint ${value}`);

      Character.Humanoid.RootPart.CFrame = checkpoint.CFrame.add(new Vector3(0, 6, 0));
    });
  }
}