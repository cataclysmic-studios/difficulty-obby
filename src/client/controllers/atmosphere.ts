import { Controller, type OnInit } from "@flamework/core";
import { Lighting } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { getZoneModel } from "shared/zones";

import type { ZonesController } from "./zones";

@Controller({ loadOrder: 0 })
export class AtmosphereController implements OnInit, LogStart {
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