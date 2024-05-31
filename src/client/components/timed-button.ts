import type { OnStart } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { TimedPart } from "./timed-part";

interface Attributes {
  readonly TimedButton_Number: number;
  readonly TimedButton_Time: number;
}

@Component({ tag: "TimedButton" })
export class TimedButton extends BaseComponent<Attributes, BasePart> implements OnStart {
  private readonly defaultColor = this.instance.Color;

  public constructor(
    private readonly components: Components
  ) { super(); }

  public onStart(): void {
    let debounce = false;
    this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (character === undefined || humanoid === undefined) return;
      if (debounce) return;

      this.instance.Color = Color3.fromRGB(255, 0, 0);
      this.toggle(true);

      task.delay(this.attributes.TimedButton_Time, () => {
        this.instance.Color = this.defaultColor;
        this.toggle(false);
        task.wait(0.5);
        debounce = false;
      });
    });
  }

  private toggle(on: boolean): void {
    for (const timedPart of this.components.getAllComponents<TimedPart>()) {
      if (timedPart.attributes.TimedPart_LinkedButton !== this.attributes.TimedButton_Number) continue;
      timedPart.toggle(on);
    }
  }
}