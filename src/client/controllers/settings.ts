import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { Events } from "client/network";
import { reverse } from "shared/utility/array";

type SettingValue = boolean;

@Controller()
export class SettingsController implements OnInit, LogStart {
  private readonly originalMusicVolume = Sound.Music.Volume;
  private readonly originalFXVolume = Sound.SoundEffects.Volume;

  public onInit(): void {
    Events.data.updated.connect((directory, value) => {
      const [settingName, dataName] = reverse(directory.split("/"));
      if (dataName !== "settings") return;
      this.updateSetting(settingName, <SettingValue>value);
    });
  }

  private updateSetting(name: string, value: SettingValue): void {
    switch (name) {
      case "music": {
        Sound.Music.Volume = value ? this.originalMusicVolume : 0;
        break;
      }
      case "soundEffects": {
        Sound.SoundEffects.Volume = value ? this.originalFXVolume : 0;
        break;
      }
      case "hidePlayers": {
        // TODO
      }
    }
  }
}