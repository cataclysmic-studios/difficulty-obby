import { Controller, type OnInit } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { SoundService as Sound } from "@rbxts/services";

import { Events } from "client/network";

@Controller()
export class SoundEffectsController implements OnInit {
  public onInit(): void {
    Events.playSoundEffect.connect(soundName => this.play(soundName));
  }

  public playIn(soundName: SoundEffectName, instance: Instance, onEnd?: () => void): Sound {
    const janitor = new Janitor;
    const sound = Sound.SoundEffects[soundName].Clone();
    janitor.Add(sound);
    janitor.Add(sound.Ended.Connect(() => {
      janitor.Cleanup();
      onEnd?.();
    }));
    janitor.Add(sound.Stopped.Connect(() => {
      janitor.Cleanup();
      onEnd?.();
    }));

    sound.Parent = instance;
    sound.Play();
    return sound;
  }

  public play(soundName: SoundEffectName): Sound {
    const sound = Sound.SoundEffects[soundName];
    sound.Play();
    return sound;
  }
}