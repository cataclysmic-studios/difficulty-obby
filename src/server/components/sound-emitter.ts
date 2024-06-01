import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
  readonly SoundEmitter_MinimumTime: number;
  readonly SoundEmitter_MaximumTime: number;
}

@Component({ tag: "SoundEmitter" })
export class SoundEmitter extends BaseComponent<Attributes, BasePart> implements OnStart {
  public onStart(): void {
    const sounds = this.instance.GetChildren().filter((i): i is Sound => i.IsA("Sound"));
    task.spawn(() => {
      while (task.wait(math.random(this.attributes.SoundEmitter_MinimumTime, this.attributes.SoundEmitter_MaximumTime))) {
        const sound = sounds[math.random(0, sounds.size() - 1)];
        sound.Play();
      }
    });
  }
}