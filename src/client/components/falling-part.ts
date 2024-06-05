import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";

import { tween } from "shared/utility/ui";

import DestroyableComponent from "shared/base-components/destroyable";
import type { CharacterController } from "client/controllers/character";
import type { CheckpointsController } from "client/controllers/checkpoints";

interface Attributes {
  FallingPart_StableLength: number;
  FallingPart_ResetTime: number; // time to reset and let allow to fall again
  FallingPart_ShakeAxis: Axis;
  FallingPart_ShakeTime: number; // amount of time to shake back & forth once
  FallingPart_ShakeAmount: number; // in degrees
  FallingPart_CleanupTime: number; // time to destroy falling part after falling
  readonly FallingPart_ColliderHeight: number;
}

@Component({
  tag: "FallingPart",
  defaults: {
    FallingPart_StableLength: 0.75,
    FallingPart_ResetTime: 5,
    FallingPart_ShakeAxis: "Y",
    FallingPart_ShakeTime: 0.2,
    FallingPart_ShakeAmount: 3,
    FallingPart_CleanupTime: 0.5
  }
})
export class FallingPart extends DestroyableComponent<Attributes, BasePart> implements OnStart {
  private readonly aboutToFall = Sound.SoundEffects.AboutToFall.Clone();
  private readonly defaultOrientation = this.instance.Orientation;
  private readonly shakeTweenInfo = new TweenInfoBuilder()
    .SetTime(this.attributes.FallingPart_ShakeTime / 2)
    .SetEasingStyle(Enum.EasingStyle.Linear);

  public constructor(
    private readonly character: CharacterController,
    private readonly checkpoints: CheckpointsController
  ) { super(); }

  public onStart(): void {
    this.aboutToFall.Parent = this.instance;

    const collider = new Instance("Part");
    const colliderHeight = this.attributes.FallingPart_ColliderHeight;
    collider.Name = "FallingPartCollider";
    collider.Transparency = 1;
    collider.Anchored = true;
    collider.CanCollide = false;
    collider.Size = new Vector3(this.instance.Size.X, colliderHeight, this.instance.Size.Z);
    collider.CFrame = this.instance.CFrame.sub(this.instance.CFrame.UpVector.mul(colliderHeight / 2));
    collider.Parent = this.instance;

    let debounce = false;
    this.janitor.Add(collider.Touched.Connect(hit => {
      const character = this.character.get();
      if (hit.FindFirstAncestorOfClass("Model") !== character) return;
      if (debounce) return;
      debounce = true;

      task.delay(this.attributes.FallingPart_StableLength + this.attributes.FallingPart_ResetTime, () => debounce = false);
      this.break();
    }));
  }

  private break(): void {
    const stopShake = this.shake();
    this.aboutToFall.Play();
    task.wait(this.attributes.FallingPart_StableLength);
    this.aboutToFall.Stop();
    stopShake();

    const fallingPart = this.instance.Clone();
    const falling = Sound.SoundEffects.Falling.Clone();
    falling.Parent = fallingPart;
    falling.Ended.Once(() => falling?.Destroy());
    falling.Play();

    this.instance.CanCollide = false;
    this.instance.Transparency = 1;
    fallingPart.Parent = this.instance.Parent;
    fallingPart.CanCollide = false;
    fallingPart.Anchored = false;
    if (this.instance.HasTag("KillPart"))
      fallingPart.Touched.Connect(hit => {
        const character = this.character.get();
        if (hit.FindFirstAncestorOfClass("Model") !== character) return;
        this.checkpoints.respawn();
      });

    task.delay(this.attributes.FallingPart_CleanupTime, () => fallingPart.Destroy());
    task.delay(this.attributes.FallingPart_ResetTime, () => {
      this.instance.CanCollide = true;
      this.instance.Transparency = 0;
    });
  }

  private shake(): () => void {
    const degrees = this.attributes.FallingPart_ShakeAmount;
    let x = 0;
    let y = 0;
    let z = 0;
    switch (this.attributes.FallingPart_ShakeAxis) {
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