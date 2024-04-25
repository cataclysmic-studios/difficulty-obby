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
    WindPart_Speed: 5
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

    collider.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      const root = humanoid?.RootPart;
      print(root, humanoid, character)
      if (humanoid === undefined || root === undefined) return;
      if (root.GetAttribute("HasForce")) return;
      root.SetAttribute("HasForce", true);

      const force = new Instance("VectorForce");
      force.Name = this.forceName;
      force.Attachment0 = <Attachment>root.WaitForChild("RootAttachment");
      force.ApplyAtCenterOfMass = true;
      force.RelativeTo = Enum.ActuatorRelativeTo.World;
      force.Parent = root;
      force.Force = this.collider.CFrame.LookVector
        .mul(this.attributes.WindPart_Speed * 500)
        .add(new Vector3(0, 100, 0));
    });
    collider.TouchEnded.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      const root = humanoid?.RootPart;
      if (humanoid === undefined || root === undefined) return;

      root.SetAttribute("HasForce", false);
      const force = <Maybe<VectorForce>>root.FindFirstChild(this.forceName);
      force?.Destroy();
    });

    Assets.VFX.Wind.Clone().Parent = collider;
  }

  public onTick(dt: number): void {
    if (this.collider === undefined) return;
    const charactersTouching = removeDuplicates(this.collider.GetTouchingParts()
      .mapFiltered(part => part.FindFirstAncestorOfClass("Model"))
      .filter(model => Players.GetPlayers().mapFiltered(player => player.Character).includes(model)));

    this.sound.Playing = charactersTouching.size() !== 0;
  }
}