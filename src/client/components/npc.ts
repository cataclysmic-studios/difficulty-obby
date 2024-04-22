import type { OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Workspace as World } from "@rbxts/services";
import { toRegion3 } from "shared/utility/3D";

interface Attributes { }

interface NPCModel extends Model {
  RootPart: Part;
  CommunicationRadius: Part;
  AnimationController: AnimationController & {
    Animator: Animator;
  };
  Animations: Folder & {
    Idle: Animation;
  };
}

@Component({ tag: "NPC" })
export class NPC extends BaseComponent<Attributes, NPCModel> implements OnStart, OnTick {
  private readonly animations: Record<string, AnimationTrack> = {};
  private readonly communicationRegion = toRegion3(this.instance.CommunicationRadius);

  public onStart(): void {
    this.loadAnimations();
    this.playAnimation("Idle");
  }

  public onTick(dt: number): void {

  }

  private loadAnimations(): void {
    for (const animation of <Animation[]>this.instance.Animations.GetChildren())
      this.animations[animation.Name] = this.instance.AnimationController.Animator.LoadAnimation(animation);
  }

  private playAnimation(name: string): void {
    this.animations[name].Play();
  }
}