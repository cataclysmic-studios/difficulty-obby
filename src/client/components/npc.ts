import type { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { doubleSidedLimit } from "shared/utility/numbers";
import { tween } from "shared/utility/ui";

import type { CharacterController } from "client/controllers/character";
import type { ProximityPromptController } from "client/controllers/proximity-prompt";
import { StorePage } from "./ui/pages/store";

const { min, deg, asin, atan2 } = math;

interface Attributes {
  NPC_CommunicationRadius: number;
}

@Component({
  tag: "NPC",
  defaults: {
    NPC_CommunicationRadius: 12
  }
})
export class NPC extends BaseComponent<Attributes, NPCModel> implements OnStart, OnTick {
  private readonly animations: Record<string, AnimationTrack> = {};
  private readonly neckBone = this.instance.RootPart.spine["spine.001"]["spine.002"]["spine.003"]["spine.005"]["spine.006"];
  private readonly talkActionID = "Shopkeeper.Talk";
  private idleHeadOrientation!: Vector3;

  public constructor(
    private readonly components: Components,
    private readonly character: CharacterController,
    private readonly proximityPrompt: ProximityPromptController
  ) { super(); }

  public onStart(): void {
    this.loadAnimations();
    this.playAnimation("Idle");

    this.idleHeadOrientation = this.neckBone.Orientation;
    this.proximityPrompt.activated.Connect(actionID => {
      if (actionID === undefined || actionID !== this.talkActionID) return;
      this.components.getAllComponents<StorePage>()[0].toggle(true);
    });
  }

  public onTick(dt: number): void {
    const character = this.character.get();
    if (character === undefined || character.Humanoid.RootPart === undefined) return;

    const characterPosition = character.Humanoid.RootPart.Position.add(new Vector3(0, 3.5, 0));
    const positionDifference = characterPosition.sub(this.neckBone.WorldPosition);
    const characterDistance = positionDifference.Magnitude;
    const inRadius = characterDistance <= this.attributes.NPC_CommunicationRadius;
    if (inRadius) {
      if (!this.isAnimationPlaying("FreeHead"))
        this.onRadiusEntered();

      this.facePlayer(positionDifference.Unit);
    } else
      if (this.isAnimationPlaying("FreeHead"))
        this.onRadiusLeft();
  }

  private onRadiusEntered(): void {
    this.playAnimation("FreeHead");
    this.proximityPrompt.setAction("Talk", this.talkActionID);
    this.proximityPrompt.toggle(true);
  }

  private onRadiusLeft(): void {
    this.stopAnimation("FreeHead");
    this.proximityPrompt.toggle(false);
    tween(this.neckBone, new TweenInfoBuilder().SetTime(0.55), {
      Orientation: this.idleHeadOrientation
    });
  }

  private facePlayer(direction: Vector3) {
    const yaw = doubleSidedLimit(deg(atan2(direction.X, direction.Z)), 60);
    const pitch = min(deg(asin(direction.Y)), 15);
    const orientation = new Vector3(pitch, yaw, 0);
    this.neckBone.Orientation = this.neckBone.Orientation.Lerp(orientation, 0.1);
  }

  private loadAnimations(): void {
    for (const animation of <Animation[]>this.instance.Animations.GetChildren())
      this.animations[animation.Name] = this.instance.AnimationController.Animator.LoadAnimation(animation);
  }

  private playAnimation(name: string): void {
    this.animations[name].Play();
  }

  private stopAnimation(name: string): void {
    this.animations[name].Stop();
  }

  private isAnimationPlaying(name: string): boolean {
    return this.animations[name].IsPlaying;
  }
}