import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { Events, Functions } from "client/network";
import { reverse } from "shared/utility/array";

import type { CheckpointsController } from "./checkpoints";
import type { PlayerHidingController } from "./player-hiding";

type SettingValue = boolean;

@Controller()
export class SettingsController implements OnInit, LogStart {
  private readonly originalZoneMusicVolume = Sound.ZoneMusic.Volume;
  private readonly originalLobbyMusicVolume = Sound.LobbyMusic.Volume;
  private readonly originalFXVolume = Sound.SoundEffects.Volume;
  private readonly originalBoomboxVolume = Sound.Boombox.Volume;

  public constructor(
    private readonly checkpoints: CheckpointsController,
    private readonly playerHiding: PlayerHidingController
  ) { }

  public onInit(): void {
    Events.data.updated.connect((directory, value) => {
      const [settingName, dataName] = reverse(directory.split("/"));
      if (dataName !== "settings") return;
      this.updateSetting(settingName, <SettingValue>value);
    });
  }

  public async get<T>(name: string): Promise<T> {
    return <T>await Functions.data.get(`settings/${name}`);
  }

  private updateSetting(name: string, value: SettingValue): void {
    switch (name) {
      case "music": {
        if (this.checkpoints.inLobby) return;
        Sound.ZoneMusic.Volume = value ? this.originalZoneMusicVolume : 0;
        break;
      }
      case "lobbyMusic": {
        Sound.LobbyMusic.Volume = value ? this.originalLobbyMusicVolume : 0;
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