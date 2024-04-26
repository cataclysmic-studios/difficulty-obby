import { Controller, type OnInit } from "@flamework/core";
import { Lighting } from "@rbxts/services";

import { getZoneModel } from "shared/zones";
import { ZonesController } from "./zones";

@Controller()
export class AtmosphereController implements OnInit {
  private currentAmbience?: Sound

  public constructor(
    private readonly zone: ZonesController
  ) { }

  public onInit(): void {
    this.zone.changed.Connect((_, stage) => this.update(stage));
  }

  public update(stage: number): void {
    const zoneModel = getZoneModel(stage);
    const zoneLighting = zoneModel.WaitForChild("Lighting");
    const ambience = <Sound>zoneModel.WaitForChild("Ambience");
    if (this.currentAmbience === ambience) return;
    this.currentAmbience?.Stop();
    this.currentAmbience = ambience;
    this.currentAmbience.Play();

    const oldLighting = Lighting.GetChildren().filter(i => !i.HasTag("DefaultLighting"));
    for (const lighting of oldLighting)
      lighting.Destroy();
    for (const lighting of zoneLighting.GetChildren())
      lighting.Clone().Parent = Lighting;
  }
}