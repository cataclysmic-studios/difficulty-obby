import { OnRender, OnStart } from "@flamework/core";
import { Component } from "@flamework/components";

import Spring from "shared/classes/spring";
import BaseButtonAnimation from "client/base-components/base-button-animation";
import { flattenNumber } from "shared/utility/numbers";

const { max } = math;

interface Attributes {
  readonly SpringScaleAnimation_ScaleIncrement: number;
  readonly SpringScaleAnimation_Mass: number;
  readonly SpringScaleAnimation_Force: number;
  readonly SpringScaleAnimation_Damping: number;
  readonly SpringScaleAnimation_Speed: number;
}

@Component({
  tag: "SpringScaleAnimation",
  defaults: {
    SpringScaleAnimation_ScaleIncrement: 0.15,
    SpringScaleAnimation_Mass: 12,
    SpringScaleAnimation_Force: 180,
    SpringScaleAnimation_Damping: 5,
    SpringScaleAnimation_Speed: 10
  }
})
export class SpringScaleAnimation extends BaseButtonAnimation<Attributes> implements OnStart, OnRender {
  private readonly scale = this.instance.FindFirstChildOfClass("UIScale") ?? new Instance("UIScale", this.instance);
  private readonly defaultScale = this.scale.Scale;
  private readonly scaleIncrement = this.attributes.SpringScaleAnimation_ScaleIncrement;
  private readonly spring = new Spring(
    this.attributes.SpringScaleAnimation_Mass,
    this.attributes.SpringScaleAnimation_Force,
    this.attributes.SpringScaleAnimation_Damping,
    this.attributes.SpringScaleAnimation_Speed
  );

  protected active = undefined;
  protected inactive = undefined;

  public onStart(): void {
    super.onStart();
  }

  public onRender(dt: number): void {
    if (this.hovered)
      this.spring.shove(new Vector3(this.scaleIncrement, 0, 0));

    const movement = this.spring.update(dt);
    this.scale.Scale = this.defaultScale + max(flattenNumber(movement.X, 0.06), 0);
  }
}