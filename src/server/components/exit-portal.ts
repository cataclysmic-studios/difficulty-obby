import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players, Workspace as World } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { Events } from "server/network";
import { ZONE_NAMES } from "shared/constants";
import Log from "shared/logger";

interface Attributes {
  readonly ExitPortal_DestinationZone: string;
}

@Component({ tag: "ExitPortal" })
export class ExitPortal extends BaseComponent<Attributes, PortalModel> implements OnStart, LogStart {
  public onStart(): void {
    const zoneName = this.attributes.ExitPortal_DestinationZone;
    this.instance.ZoneName.GUI.Title.Text = zoneName;

    let db = false;
    this.instance.Collider.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (humanoid === undefined) return;
      if (db) return;
      db = true;
      task.delay(1, () => db = false);

      const root = humanoid.RootPart;
      if (root === undefined) return;

      const zoneNumber = ZONE_NAMES.indexOf(zoneName);
      if (zoneNumber === -1)
        return Log.warning(`Zone "${zoneName}" does not exist in World.Zones`);

      const player = Players.GetPlayerFromCharacter(character);
      const defaultWalkSpeed = humanoid.WalkSpeed;
      const defaultJumpHeight = humanoid.JumpHeight;
      const fadeTime = 0.5;

      humanoid.WalkSpeed = 0;
      humanoid.JumpHeight = 0;
      if (player !== undefined) {
        Events.uiEffects.fadeBlack(player, 0.75, fadeTime);
        task.wait(fadeTime);
      }

      const startPointNumber = zoneNumber === 0 ? 0 : (zoneNumber * 20) + 1;
      const destinationZoneSpawn = <SpawnLocation>World.StartPoints.WaitForChild(tostring(startPointNumber));
      root.CFrame = destinationZoneSpawn.CFrame.add(new Vector3(0, 6, 0));

      task.delay(fadeTime, () => {
        humanoid.WalkSpeed = defaultWalkSpeed;
        humanoid.JumpHeight = defaultJumpHeight;
      });
    });
  }
}