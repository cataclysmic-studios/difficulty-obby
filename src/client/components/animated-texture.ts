import type { OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

const MAX_OFFSET = 500;

interface Attributes {
  AnimatedTexture_Speed: number;
}

@Component({
  tag: "AnimatedTexture",
  defaults: {
    AnimatedTexture_Speed: 0.1
  }
})
export class AnimatedTexture extends BaseComponent<Attributes, Texture> implements OnTick {
  public onTick(dt: number): void {
    this.instance.OffsetStudsU += this.attributes.AnimatedTexture_Speed * dt * 60;
    this.instance.OffsetStudsU %= MAX_OFFSET;
  }
}