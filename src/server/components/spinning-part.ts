import type { OnPhysics } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
  SpinningPart_Speed: number;
  SpinningPart_Axis: Axis;
}

@Component({
  tag: "SpinningPart",
  defaults: {
    SpinningPart_Speed: 1,
    SpinningPart_Axis: "Y"
  }
})
export class SpinningPart extends BaseComponent<Attributes, BasePart> implements OnPhysics {
  public onPhysics(dt: number): void {
    const speed = this.attributes.SpinningPart_Speed * dt * 600;
    let x = 0;
    let y = 0;
    let z = 0;
    switch (this.attributes.SpinningPart_Axis) {
      case "X": {
        x = speed;
        break;
      }
      case "Y": {
        y = speed;
        break;
      }
      case "Z": {
        z = speed;
        break;
      }
    }

    this.instance.Orientation = this.instance.Orientation.Lerp(this.instance.Orientation.add(new Vector3(x, y, z)), 0.1);
  }
}