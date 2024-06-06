import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";

interface Attributes {
  readonly ExitPortal_DestinationZone?: string;
}

@Component({ tag: "Portal" })
export class Portal extends BaseComponent<Attributes, PortalModel> implements OnStart {
  public onStart(): void {
    if (this.instance.HasTag("ExitPortal") || this.instance.HasTag("EntrancePortal"))
      this.instance.ZoneName.GUI.Title.Text = this.instance.HasTag("EntrancePortal") ? this.instance.Parent!.Name : this.attributes.ExitPortal_DestinationZone!;

    const ambienceSound = Sound.SoundEffects.Portal.Clone();
    ambienceSound.Parent = this.instance.Collider;
  }
}