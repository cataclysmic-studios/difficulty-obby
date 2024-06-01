import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";

interface Attributes {
  BouncePad_Force: number;
}

@Component({ tag: "BouncePad" })
export class BouncePad extends BaseComponent<Attributes, BasePart> implements OnStart {
  public onStart(): void {
    const boing = Sound.SoundEffects.Boing.Clone();
    boing.Parent = this.instance;

    let debounce = false;
    this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (character === undefined || humanoid === undefined || humanoid.RootPart === undefined) return;
      if (debounce) return;
      debounce = true;
      task.delay(0.25, () => debounce = false);

      boing.Play();
      humanoid.RootPart.AssemblyLinearVelocity = humanoid.RootPart.AssemblyLinearVelocity.add(new Vector3(0, this.attributes.BouncePad_Force * 3, 0));
    });
  }
}