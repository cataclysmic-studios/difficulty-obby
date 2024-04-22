import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Workspace as World } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { ZONE_INFO } from "shared/constants";
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

      const zoneNumber = ZONE_INFO.indexOf(zoneName);
      if (zoneNumber === -1)
        return Log.warning(`Zone "${zoneName}" does not exist in World.Zones`);

      const startPointNumber = zoneNumber === 0 ? 0 : (zoneNumber * 20) + 1;
      const destinationZoneSpawn = <SpawnLocation>World.StartPoints.WaitForChild(tostring(startPointNumber));
      root.CFrame = destinationZoneSpawn.CFrame.add(new Vector3(0, 6, 0));
    });
  }
}