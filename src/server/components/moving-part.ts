import type { OnStart } from "@flamework/core";
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
export class MovingPart extends BaseComponent<Attributes, BasePart> implements OnStart {
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

  private getDirection(): Vector3 {
    return this.instance.CFrame.LookVector;
  }
}