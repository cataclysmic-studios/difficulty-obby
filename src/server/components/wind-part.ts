import type { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players, SoundService as Sound } from "@rbxts/services";

import { Assets } from "shared/utility/instances";
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
  private readonly forceName = "WindForce";
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

    Assets.VFX.Wind.Clone().Parent = collider;
  }

  public onTick(dt: number): void {
    if (this.collider === undefined) return;
    const charactersTouching = removeDuplicates(this.collider.GetTouchingParts()
      .mapFiltered(part => part.FindFirstAncestorOfClass("Model"))
      .filter(model => model.FindFirstChildOfClass("Humanoid") !== undefined));

    if (charactersTouching.size() === 0)
      this.sound.Playing = false;

    task.spawn(() => {
      const charactersNotTouching = Players.GetPlayers()
        .mapFiltered(player => player.Character)
        .filter(character => !charactersTouching.includes(character));

      for (const character of charactersNotTouching)
        task.spawn(() => {
          const root = <BasePart>character.FindFirstChild("HumanoidRootPart");
          if (root === undefined) return;
          const mover = <Maybe<VectorForce>>root.FindFirstChild(this.forceName);
          mover?.Destroy();
        });
    });

    for (const character of charactersTouching)
      task.spawn(() => {
        this.sound.Playing = true;
        const root = <BasePart>character.FindFirstChild("HumanoidRootPart");
        if (root === undefined) return;

        let mover = <VectorForce>root.FindFirstChild(this.forceName);
        const foundMover = mover !== undefined;
        mover ??= new Instance("VectorForce");
        if (!foundMover) {
          mover.Name = this.forceName;
          mover.Attachment0 = <Attachment>root.WaitForChild("RootAttachment");
          mover.ApplyAtCenterOfMass = true;
          mover.RelativeTo = Enum.ActuatorRelativeTo.World;
          mover.Parent = root;
        }

        mover.Force = this.collider.CFrame.LookVector.mul(this.attributes.WindPart_Speed * 500);
      });
  }
}