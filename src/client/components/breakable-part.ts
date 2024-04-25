import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";

import type { CharacterController } from "client/controllers/character";
import DestroyableComponent from "shared/base-components/destroyable";

interface Attributes {
  BreakablePart_StableLength: number;
  BreakablePart_ResetTime: number;
}

@Component({
  tag: "BreakablePart",
  defaults: {
    BreakablePart_StableLength: 0.75,
    BreakablePart_ResetTime: 5
  }
})
export class BreakablePart extends DestroyableComponent<Attributes, BasePart> implements OnStart {
  public constructor(
    private readonly character: CharacterController
  ) { super(); }

  public onStart(): void {
    const aboutToFall = Sound.SoundEffects.AboutToFall.Clone();
    aboutToFall.Parent = this.instance;

    let debounce = false;
    this.janitor.Add(this.instance.Touched.Connect(hit => {
      const character = this.character.get();
      if (hit.FindFirstAncestorOfClass("Model") !== character) return;
      if (debounce) return;
      debounce = true;
      task.delay(this.attributes.BreakablePart_StableLength + this.attributes.BreakablePart_ResetTime, () => debounce = false);

      aboutToFall.Play();
      task.wait(this.attributes.BreakablePart_StableLength);
      aboutToFall.Stop();

      const fallingPart = this.instance.Clone();
      const falling = Sound.SoundEffects.Falling.Clone();
      falling.Parent = fallingPart;
      falling.Ended.Once(() => falling?.Destroy());
      falling.Play();

      fallingPart.RemoveTag("FallingPart");
      fallingPart.Parent = this.instance.Parent;
      fallingPart.CanCollide = false;
      fallingPart.Anchored = false;
      this.instance.CanCollide = false;
      this.instance.Transparency = 1;
      task.delay(1.5, () => fallingPart.Destroy());
      task.delay(this.attributes.BreakablePart_ResetTime, () => {
        this.instance.CanCollide = true;
        this.instance.Transparency = 0;
      });
    }));
  }
}