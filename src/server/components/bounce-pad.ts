import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
  BouncePad_Force: number;
}

@Component({ tag: "BouncePad" })
export class BouncePad extends BaseComponent<Attributes, BasePart> implements OnStart {
  public onStart(): void {
    let debounce = false;
    this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (humanoid === undefined) return;
      if (debounce) return;
      debounce = true;
      task.delay(0.25, () => debounce = false);

      humanoid.RootPart?.ApplyImpulse(new Vector3(0, this.attributes.BouncePad_Force, 0).mul(50));
    });
  }
}