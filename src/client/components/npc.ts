import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes { }

interface NPCModel extends Model {
  RootPart: Part;
  AnimationController: AnimationController & {
    Animator: Animator;
  };
  Animations: Folder & {
    Idle: Animation;
  };
}

@Component({ tag: "NPC" })
export class NPC extends BaseComponent<Attributes, NPCModel> implements OnStart {
  private readonly animations: Record<string, AnimationTrack> = {};

  public onStart(): void {
    this.loadAnimations();
    this.playAnimation("Idle");
  }

  private loadAnimations(): void {
    for (const animation of <Animation[]>this.instance.Animations.GetChildren())
      this.animations[animation.Name] = this.instance.AnimationController.Animator.LoadAnimation(animation);
  }

  private playAnimation(name: string): void {
    this.animations[name].Play();
  }
}