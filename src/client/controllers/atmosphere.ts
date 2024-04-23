import { Controller, type OnStart } from "@flamework/core";
import { Workspace as World, Lighting } from "@rbxts/services";

import { Functions } from "client/network";
import { getZoneName } from "shared/constants";

@Controller()
export class AtmosphereController implements OnStart {
  public async onStart(): Promise<void> {
    this.update(<number>await Functions.data.get("stage"))
  }

  public update(stage: number): void {
    const currentZone = getZoneName(stage);
    const zoneLighting = World.Zones.WaitForChild(currentZone).WaitForChild("Lighting");
    const oldLighting = Lighting.GetChildren().filter(i => !i.HasTag("DefaultLighting"));
    for (const lighting of oldLighting)
      lighting.Destroy();
    for (const lighting of zoneLighting.GetChildren())
      lighting.Clone().Parent = Lighting;
  }
}