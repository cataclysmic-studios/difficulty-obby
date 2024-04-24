import type { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";

import { removeDuplicates } from "shared/utility/array";

interface Attributes {
  WindPart_Speed: number;
  WindPart_Distance: number;
}

@Component({
  tag: "WindPart",
  defaults: {
    WindPart_Speed: 10
  }
})
export class WindPart extends BaseComponent<Attributes, BasePart> implements OnStart, OnTick {
  private readonly sound = Sound.SoundEffects.Wind.Clone();
  private collider!: Part;

  public onStart(): void {
    this.sound.Parent = this.instance;

    const collider = new Instance("Part");
    collider.Name = "WindCollider";
    collider.Transparency = 1;
    collider.Anchored = true;
    collider.Size = new Vector3(this.instance.Size.X, this.instance.Size.Y, this.attributes.WindPart_Distance);
    collider.CFrame = this.instance.CFrame.add(this.instance.CFrame.LookVector.mul(this.attributes.WindPart_Distance / 2));
    collider.Parent = this.instance;
    this.collider = collider;
  }

  public onTick(dt: number): void {
    if (this.collider === undefined) return;
    const charactersTouching = removeDuplicates(this.collider.GetTouchingParts()
      .mapFiltered(part => part.FindFirstAncestorOfClass("Model"))
      .filter(model => model.FindFirstChildOfClass("Humanoid") !== undefined));

    if (charactersTouching.size() === 0)
      this.sound.Playing = false;
    for (const character of charactersTouching)
      task.spawn(() => {
        const root = <BasePart>character.FindFirstChild("HumanoidRootPart");
        root.AssemblyLinearVelocity = root.AssemblyLinearVelocity.add(this.collider.CFrame.LookVector.mul(this.attributes.WindPart_Speed));
        this.sound.Playing = true;
      });
  }
}