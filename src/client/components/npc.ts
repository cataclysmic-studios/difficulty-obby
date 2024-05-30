import type { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { doubleSidedLimit } from "shared/utility/numbers";
import { PlayerGui } from "shared/utility/client";
import { tween } from "shared/utility/ui";

import type { StorePage } from "./ui/pages/store";
import type { CharacterController } from "client/controllers/character";
import type { ProximityPromptController } from "client/controllers/proximity-prompt";

const { random, clamp, deg, asin, atan2 } = math;

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

  public async onStart(): Promise<void> {
    this.loadAnimations();
    this.playAnimation("Idle");

    this.idleHeadOrientation = this.neckBone.Orientation;
    this.storePage = await this.components.waitForComponent<StorePage>(PlayerGui.WaitForChild("Main").WaitForChild("Store"));
    this.storePage.itemPurchased.Connect(() => {
      const gratitudeAnimations = <Animation[]>this.instance.Animations.Gratitude.GetChildren();
      const gratitudeAnimation = gratitudeAnimations[random(0, gratitudeAnimations.size() - 1)];
      this.playAnimation(gratitudeAnimation.Name);
      this.playVoiceLine("Gratitude");
    });
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

      this.facePlayer(CFrame.lookAt(this.neckBone.WorldPosition, characterPosition).LookVector);
    } else
      if (this.isAnimationPlaying("FreeHead"))
        this.onRadiusLeft();
  }

  private onRadiusEntered(): void {
    this.playAnimation("FreeHead");
    this.playVoiceLine("Greeting");
    this.proximityPrompt.setAction("Talk", this.talkActionID);
    this.proximityPrompt.toggle(true);
  }

  private onRadiusLeft(): void {
    this.stopAnimation("FreeHead");
    this.playVoiceLine("Goodbye");
    this.proximityPrompt.toggle(false);
    tween(this.neckBone, new TweenInfoBuilder().SetTime(0.55), {
      Orientation: this.idleHeadOrientation
    });
  }

  private facePlayer(direction: Vector3): void {
    const pitch = clamp(deg(asin(direction.Y)), -20, 15);
    const yaw = -doubleSidedLimit(deg(atan2(direction.Z, direction.X)), 60);
    const orientation = new Vector3(pitch, yaw, 0);
    this.neckBone.Orientation = this.neckBone.Orientation.Lerp(orientation, 0.1);
  }

  private playVoiceLine(name: string): void {
    if (this.isVoiceLinePlaying()) return;
    const voiceLineCollection = <Sound[]>this.instance.VoiceLines.WaitForChild(name).GetChildren();
    const voiceLine = voiceLineCollection[random(0, voiceLineCollection.size() - 1)];
    const originalParent = voiceLine.Parent;
    voiceLine.Parent = this.instance.Head;
    voiceLine.Ended.Once(() => {
      voiceLine.Parent = originalParent;
      this.stopAnimation("Talking");
    });

    voiceLine.Play();
    this.playAnimation("Talking");
  }

  private isVoiceLinePlaying(): boolean {
    return this.instance
      .GetDescendants()
      .filter((i): i is Sound => i.IsA("Sound"))
      .map(voiceLine => voiceLine.IsPlaying)
      .reduce((isAnyPlaying, isPlaying) => isAnyPlaying ||= isPlaying);
  }

  private loadAnimations(): void {
    for (const animation of <Animation[]>this.instance.Animations.GetDescendants()) {
      if (!animation.IsA("Animation")) continue;
      this.animations[animation.Name] = this.instance.AnimationController.Animator.LoadAnimation(animation);
    }
  }

  private playAnimation(name: string): void {
    this.getAnimation(name).Play();
  }

  private stopAnimation(name: string): void {
    this.getAnimation(name).Stop();
  }

  private isAnimationPlaying(name: string): boolean {
    return this.getAnimation(name)?.IsPlaying;
  }

  private getAnimation(name: string): AnimationTrack {
    return this.animations[name];
  }
}