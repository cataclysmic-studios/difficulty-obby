import type { OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utility/client";

const { min } = math;

interface Attributes {
  Spin_Degrees: number;
}

@Component({
  tag: "Spin",
  ancestorWhitelist: [PlayerGui],
  defaults: {
    Spin_Degrees: 3
  }
})
export class Spin extends BaseComponent<Attributes, GuiObject> implements OnTick {
  public onTick(dt: number): void {
    dt = min(dt, 1);
    this.instance.Rotation += this.attributes.Spin_Degrees * dt * 60;
  }
}