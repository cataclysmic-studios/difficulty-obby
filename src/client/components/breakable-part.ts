import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";

import type { CharacterController } from "client/controllers/character";
import DestroyableComponent from "shared/base-components/destroyable";
import { tween } from "shared/utility/ui";
import { TweenInfoBuilder } from "@rbxts/builders";

interface Attributes {
  BreakablePart_StableLength: number;
  BreakablePart_ResetTime: number;
  BreakablePart_ShakeAxis: Axis;
  BreakablePart_ShakeTime: number;
  BreakablePart_ShakeAmount: number;
}

@Component({
  tag: "BreakablePart",
  defaults: {
    BreakablePart_StableLength: 0.75,
    BreakablePart_ResetTime: 5,
    BreakablePart_ShakeAxis: "Y",
    BreakablePart_ShakeTime: 0.2,
    BreakablePart_ShakeAmount: 3
  }
})
export class BreakablePart extends DestroyableComponent<Attributes, BasePart> implements OnStart {
  private readonly aboutToFall = Sound.SoundEffects.AboutToFall.Clone();
  private readonly defaultOrientation = this.instance.Orientation;
  private readonly shakeTweenInfo = new TweenInfoBuilder()
    .SetTime(this.attributes.BreakablePart_ShakeTime / 2)
    .SetEasingStyle(Enum.EasingStyle.Linear);

  public constructor(
    private readonly character: CharacterController
  ) { super(); }

  public onStart(): void {
    this.aboutToFall.Parent = this.instance;

    let debounce = false;
    this.janitor.Add(this.instance.Touched.Connect(hit => {
      const character = this.character.get();
      if (hit.FindFirstAncestorOfClass("Model") !== character) return;
      if (debounce) return;
      debounce = true;
      task.delay(this.attributes.BreakablePart_StableLength + this.attributes.BreakablePart_ResetTime, () => debounce = false);
      this.break();
    }));
  }

  private break(): void {
    const stopShake = this.shake();
    this.aboutToFall.Play();
    task.wait(this.attributes.BreakablePart_StableLength);
    this.aboutToFall.Stop();
    stopShake();

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
  }

  private shake(): () => void {
    const degrees = this.attributes.BreakablePart_ShakeAmount;
    let x = 0;
    let y = 0;
    let z = 0;
    switch (this.attributes.BreakablePart_ShakeAxis) {
      case "X": {
        x = degrees;
        break;
      }
      case "Y": {
        y = degrees;
        break;
      }
      case "Z": {
        z = degrees;
        break;
      }
    }

    const offset = new Vector3(x, y, z);
    let doShake = true;
    task.spawn(() => {
      while (doShake) {
        tween(this.instance, this.shakeTweenInfo, {
          Orientation: this.defaultOrientation.add(offset)
        }).Completed.Wait();
        tween(this.instance, this.shakeTweenInfo, {
          Orientation: this.defaultOrientation.sub(offset)
        }).Completed.Wait();
      }
    });

    return () => {
      doShake = false;
      tween(this.instance, this.shakeTweenInfo, {
        Orientation: this.defaultOrientation
      });
    };
  }
}