import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";


import type { LogStart } from "shared/hooks";

interface Attributes {
  readonly ExitPortal_DestinationZone?: string;
}

@Component({ tag: "Portal" })
export class Portal extends BaseComponent<Attributes, PortalModel> implements OnStart, LogStart {
  public onStart(): void {
    const zoneName = this.instance.HasTag("ExitPortal") ? this.attributes.ExitPortal_DestinationZone! : this.instance.FindFirstAncestorOfClass("Folder")!.Name;
    this.instance.ZoneName.GUI.Title.Text = zoneName;

    const ambienceSound = Sound.SoundEffects.Portal.Clone();
    ambienceSound.Parent = this.instance.Collider;
  }
}