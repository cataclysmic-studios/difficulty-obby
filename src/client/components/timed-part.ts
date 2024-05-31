import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
  readonly TimedPart_LinkedButton: number;
}

@Component({ tag: "TimedPart" })
export class TimedPart extends BaseComponent<Attributes, BasePart> implements OnStart {
  private readonly defaultTransparency = this.instance.Transparency;

  public onStart(): void {
    this.toggle(false);
  }

  public toggle(on: boolean): void {
    this.instance.Transparency = this.defaultTransparency + (on ? 0 : 0.5);
    this.instance.CanCollide = on;
  }
}