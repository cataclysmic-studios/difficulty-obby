import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { Events } from "client/network";
import { reverse } from "shared/utility/array";

import type { PlayerHidingController } from "./player-hiding";

type SettingValue = boolean;

@Controller()
export class SettingsController implements OnInit, LogStart {
  private readonly originalMusicVolume = Sound.ZoneMusic.Volume;
  private readonly originalFXVolume = Sound.SoundEffects.Volume;
  private readonly originalBoomboxVolume = Sound.Boombox.Volume;

  public constructor(
    private readonly playerHiding: PlayerHidingController
  ) { }

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
        Sound.ZoneMusic.Volume = value ? this.originalMusicVolume : 0;
        break;
      }
      case "soundEffects": {
        Sound.SoundEffects.Volume = value ? this.originalFXVolume : 0;
        break;
      }
      case "boomboxes": {
        Sound.Boombox.Volume = value ? this.originalBoomboxVolume : 0;
        break;
      }
      case "hidePlayers": {
        this.playerHiding.toggle(<boolean>value);
        break;
      }
    }
  }
}