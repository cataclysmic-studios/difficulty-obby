import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";

import DestroyableComponent from "shared/base-components/destroyable";

interface Attributes {
  FallingPart_StableLength: number;
  FallingPart_ResetTime: number;
}

@Component({
  tag: "FallingPart",
  defaults: {
    FallingPart_StableLength: 0.75,
    FallingPart_ResetTime: 5
  }
})
export class FallingPart extends DestroyableComponent<Attributes, BasePart> implements OnStart {
  public onStart(): void {
    const aboutToFall = Sound.SoundEffects.AboutToFall.Clone();
    aboutToFall.Parent = this.instance;

    let debounce = false;
    this.janitor.Add(this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (humanoid === undefined) return;
      if (debounce) return;
      debounce = true;
      task.delay(this.attributes.FallingPart_StableLength + this.attributes.FallingPart_ResetTime, () => debounce = false);

      aboutToFall.Play();
      task.wait(this.attributes.FallingPart_StableLength);
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
      task.delay(this.attributes.FallingPart_ResetTime, () => {
        this.instance.CanCollide = true;
        this.instance.Transparency = 0;
      });
    }));
  }
}