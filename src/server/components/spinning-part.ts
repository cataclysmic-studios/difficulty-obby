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
  private lastOrientation = this.instance.Orientation;

  public onPhysics(dt: number): void {
    const speed = this.attributes.SpinningPart_Speed * dt * 60;
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

    const spin = new Vector3(x, y, z);
    const currentOrientation = this.instance.Orientation;
    const deltaOrientation = currentOrientation.sub(this.lastOrientation);
    const angularVelocity = deltaOrientation;
    this.instance.AssemblyAngularVelocity = angularVelocity.div(this.instance.Size);
    this.lastOrientation = currentOrientation;
    this.instance.Orientation = this.instance.Orientation.add(spin);
  }
}