import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";

import { Events } from "client/network";

@Controller()
export class SoundEffectsController implements OnInit {
  public onInit(): void {
    Events.playSoundEffect.connect(soundName => Sound.SoundEffects[soundName].Play());
  }
}