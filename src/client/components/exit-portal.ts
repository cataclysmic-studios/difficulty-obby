import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Workspace as World } from "@rbxts/services";

import { ZONES } from "shared/zones";
import Log from "shared/logger";

import type { UIEffectsController } from "client/controllers/ui-effects";

interface Attributes {
  readonly ExitPortal_DestinationZone: string;
}

@Component({ tag: "ExitPortal" })
export class ExitPortal extends BaseComponent<Attributes, PortalModel> implements OnStart {
  public constructor(
    private readonly uiEffects: UIEffectsController
  ) { super(); }

  public onStart(): void {
    const zoneName = this.attributes.ExitPortal_DestinationZone;
    let debounce = false;

    this.instance.Collider.Touched.Connect(async hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (humanoid === undefined) return;
      if (debounce) return;
      debounce = true;
      task.delay(1, () => debounce = false);

      const root = humanoid.RootPart;
      if (root === undefined) return;

      const zone = ZONES.find(zone => zone.name === zoneName);
      const zoneNumber = (ZONES.map(zone => <string>zone.name)).indexOf(zoneName);
      if (zoneNumber === -1 || zone === undefined)
        return Log.warning(`Zone "${zoneName}" does not exist in World.Zones`);

      const defaultWalkSpeed = humanoid.WalkSpeed;
      const defaultJumpHeight = humanoid.JumpHeight;
      const fadeTime = 0.5;

      humanoid.WalkSpeed = 0;
      humanoid.JumpHeight = 0;
      task.delay(fadeTime, () => {
        const startPointNumber = zoneNumber === 0 ? 0 : (zoneNumber * zone.stageCount) + 1;
        const destinationZoneSpawn = <SpawnLocation>World.StartPoints.WaitForChild(tostring(startPointNumber));
        root.CFrame = destinationZoneSpawn.CFrame.add(new Vector3(0, 6, 0));
        humanoid.WalkSpeed = defaultWalkSpeed;
        humanoid.JumpHeight = defaultJumpHeight;
      });

      this.uiEffects.blackFade(false, 0.75, fadeTime);
    });
  }
}