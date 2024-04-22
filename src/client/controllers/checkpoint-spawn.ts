import { Controller, type OnInit } from "@flamework/core";
import { Workspace as World } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import { Events } from "client/network";
import { Character } from "shared/utility/client";

@Controller()
export class CheckpointSpawnController implements OnInit {
  public onInit(): void {
    const conn = Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "stage")) return;
      if (Character === undefined || Character.Humanoid === undefined) return;
      if (Character.Humanoid.RootPart === undefined) return;

      conn.Disconnect();
      const checkpoint = <SpawnLocation>World.Checkpoints.FindFirstChild(tostring(value));
      Character.Humanoid.RootPart.CFrame = checkpoint.CFrame;
    });
  }
}