import type { OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
  ConveyorPart_Speed: number;
}

@Component({
  tag: "ConveyorPart",
  defaults: {
    ConveyorPart_Speed: 5
  }
})
export class ConveyorPart extends BaseComponent<Attributes, BasePart> implements OnTick {
  public onTick(dt: number): void {
    this.instance.AssemblyLinearVelocity = this.instance.CFrame.LookVector.mul(this.attributes.ConveyorPart_Speed * dt * 60);
  }
}