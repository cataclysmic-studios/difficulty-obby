import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";

import { PlayerGui } from "shared/utility/client";

import DestroyableComponent from "shared/base-components/destroyable";

@Component({
  tag: "UISounds",
  ancestorWhitelist: [PlayerGui]
})
export class UISounds extends DestroyableComponent<{}, GuiButton> implements OnStart {
  public onStart(): void {
    this.janitor.Add(this.instance.MouseEnter.Connect(() => Sound.SoundEffects.UIHover.Play()));
    this.janitor.Add(this.instance.MouseButton1Click.Connect(() => Sound.SoundEffects.UIClick.Play()));
  }
}