import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";

import DestroyableComponent from "shared/base-components/destroyable";

interface Attributes {
  FallingPart_StableLength: number;
}

@Component({
  tag: "FallingPart",
  defaults: {
    FallingPart_StableLength: 0.75
  }
})
export class FallingPart extends DestroyableComponent<Attributes, BasePart> implements OnStart {
  public onStart(): void {
    let debounce = false;
    this.janitor.Add(this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (humanoid === undefined) return;
      if (debounce) return;
      debounce = true;
      task.delay(0.25, () => debounce = false);

      task.wait(this.attributes.FallingPart_StableLength);
      const fallingPart = this.instance.Clone();
      fallingPart.RemoveTag("FallingPart");
      fallingPart.Parent = this.instance.Parent;
      fallingPart.CanCollide = false;
      fallingPart.Anchored = false;
      this.instance.CanCollide = false;
      this.instance.Transparency = 1;
      task.delay(1.5, () => fallingPart.Destroy());
      task.delay(5, () => {
        this.instance.CanCollide = true;
        this.instance.Transparency = 0;
      });
    }));
  }
}