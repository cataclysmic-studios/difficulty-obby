import type { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { doubleSidedLimit } from "shared/utility/numbers";
import { tween } from "shared/utility/ui";

import type { StorePage } from "./ui/pages/store";
import type { CharacterController } from "client/controllers/character";
import type { ProximityPromptController } from "client/controllers/proximity-prompt";

const { random, min, deg, asin, atan2 } = math;

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
  private readonly root = this.instance.RootPart;
  private readonly neckBone = this.root.spine["spine.001"]["spine.002"]["spine.003"]["spine.005"]["spine.006"];
  private readonly talkActionID = "Shopkeeper.Talk";
  private idleHeadOrientation!: Vector3;
  private storePage!: StorePage;

  public constructor(
    private readonly components: Components,
    private readonly character: CharacterController,
    private readonly proximityPrompt: ProximityPromptController
  ) { super(); }

  public onStart(): void {
    this.loadAnimations();
    this.playAnimation("Idle");

    this.idleHeadOrientation = this.neckBone.Orientation;
    this.storePage = this.components.getAllComponents<StorePage>()[0];
    this.storePage.itemPurchased.Connect(() => this.playVoiceLine("Gratitude"));
    this.proximityPrompt.activated.Connect(actionID => {
      if (actionID === undefined || actionID !== this.talkActionID) return;
      this.storePage.toggle(true);
    });
  }

  public onTick(dt: number): void {
    const characterRoot = this.character.getRoot();
    if (characterRoot === undefined) return;

    const characterPosition = characterRoot.Position.add(new Vector3(0, 3.5, 0));
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
    this.playVoiceLine("Greeting");
  }

  private onRadiusLeft(): void {
    this.stopAnimation("FreeHead");
    this.proximityPrompt.toggle(false);
    this.playVoiceLine("Goodbye");
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

  private playVoiceLine(name: string): void {
    if (this.isVoiceLinePlaying()) return;
    const voiceLineCollection = <Sound[]>this.instance.VoiceLines.WaitForChild(name).GetChildren();
    const voiceLine = voiceLineCollection[random(0, voiceLineCollection.size() - 1)];
    const originalParent = voiceLine.Parent;
    voiceLine.Parent = this.instance.Head;
    voiceLine.Ended.Once(() => voiceLine.Parent = originalParent);
    voiceLine.Play();
  }

  private isVoiceLinePlaying(): boolean {
    return this.instance
      .GetDescendants()
      .filter((i): i is Sound => i.IsA("Sound"))
      .map(voiceLine => voiceLine.IsPlaying)
      .reduce((isAnyPlaying, isPlaying) => isAnyPlaying ||= isPlaying);
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