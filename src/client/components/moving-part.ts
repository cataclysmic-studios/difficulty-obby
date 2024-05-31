import type { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { tween } from "shared/utility/ui";
import { TweenInfoBuilder } from "@rbxts/builders";

interface Attributes {
  MovingPart_Distance: number;
  MovingPart_Delay: number;
  MovingPart_Time: number;
  MovingPart_Direction: "Forward" | "Backward" | "Right" | "Left" | "Up" | "Down";
}

@Component({
  tag: "MovingPart",
  defaults: {
    MovingPart_Delay: 0
  }
})
export class MovingPart extends BaseComponent<Attributes, BasePart> implements OnStart, OnTick {
  private lastPosition = this.instance.Position;

  public onStart(): void {
    const originalPosition = this.instance.Position;
    task.spawn(() => {
      while (this.instance !== undefined) {
        const tweenInfo = new TweenInfoBuilder()
          .SetTime(this.attributes.MovingPart_Time)
          .SetEasingStyle(Enum.EasingStyle.Linear);

        tweenInfo.SetDelayTime(this.attributes.MovingPart_Delay);
        tween(this.instance, tweenInfo, {
          Position: originalPosition.add(this.getDirection().mul(this.attributes.MovingPart_Distance))
        }).Completed.Wait();
        tween(this.instance, tweenInfo, {
          Position: originalPosition
        }).Completed.Wait();
      }
    });
  }

  public onTick(dt: number): void {
    const currentPosition = this.instance.Position;
    const deltaPosition = currentPosition.sub(this.lastPosition);
    const velocity = deltaPosition.div(dt);
    this.instance.AssemblyLinearVelocity = velocity;
    this.lastPosition = currentPosition;
  }

  private getDirection(): Vector3 {
    const cframe = this.instance.CFrame
    switch (this.attributes.MovingPart_Direction) {
      case "Forward": return cframe.LookVector;
      case "Backward": return cframe.LookVector.mul(-1);
      case "Right": return cframe.RightVector;
      case "Left": return cframe.RightVector.mul(-1);
      case "Up": return cframe.UpVector;
      case "Down": return cframe.UpVector.mul(-1);
    }
  }
}