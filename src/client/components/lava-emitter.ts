import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";
import { tween } from "shared/utility/ui";

interface Attributes {
  LavaEmitter_Interval: number;
  LavaEmitter_Lifetime: number;
}

interface LavaEmitterModel extends Model {
  Collider: Part & {
    Fire: Sound;
    Light: PointLight;
  };
  Particle: Part & {
    Attachment: Attachment & {
      Flames: ParticleEmitter;
    };
  };
};

@Component({
  tag: "LavaEmitter",
  defaults: {
    LavaEmitter_Interval: 5,
    LavaEmitter_Lifetime: 5
  }
})
export class LavaEmitter extends BaseComponent<Attributes, LavaEmitterModel> implements OnStart {
  private readonly lightTweenInfo = new TweenInfoBuilder().SetTime(1);
  private readonly lightBrightness = this.instance.Collider.Light.Brightness;

  public onStart(): void {
    this.instance.Collider.Light.Enabled = true;
    task.spawn(() => {
      while (true) {
        task.wait(this.attributes.LavaEmitter_Interval);
        this.toggle(true);
        task.wait(this.attributes.LavaEmitter_Lifetime);
        this.toggle(false);
      }
    });
  }

  private toggle(on: boolean): void {
    if (on)
      this.instance.Collider.Fire.Play();
    else
      this.instance.Collider.Fire.Stop();

    tween(this.instance.Collider.Light, this.lightTweenInfo, { Brightness: on ? this.lightBrightness : 0 });
    this.instance.Particle.Attachment.Flames.Enabled = on;
  }
}