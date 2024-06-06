import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";

import type { OnCharacterAdd } from "shared/hooks";
import { PlayerGui } from "shared/utility/client";

import type { CheckpointsController } from "./checkpoints";
import type { AtmosphereController } from "./atmosphere";
import type { SettingsController } from "./settings";

@Controller()
export class LobbyController implements OnInit, OnCharacterAdd {
  private readonly defaultZoneMusicVolume = Sound.ZoneMusic.Volume;

  public constructor(
    private readonly checkpoints: CheckpointsController,
    private readonly atmosphere: AtmosphereController,
    private readonly settings: SettingsController
  ) { }

  public onInit(): void {
    this.checkpoints.inLobbyUpdated.Connect(async inLobby => {
      if (this.checkpoints.notLobbyNotObby) return;
      const zoneName = <TextLabel>PlayerGui.WaitForChild("Main").WaitForChild("Main").WaitForChild("StageInfo").WaitForChild("ZoneName")
      const zoneMusicEnabled = await this.settings.get<boolean>("music");
      zoneName.Visible = !inLobby;
      Sound.ZoneMusic.Volume = (inLobby || !zoneMusicEnabled) ? 0 : this.defaultZoneMusicVolume;
      this.atmosphere.update(inLobby ? 0 : undefined);
    });
  }

  public onCharacterAdd(character: CharacterModel): void {
    character.Humanoid.Died.Once(() => this.checkpoints.setInLobby(true));
  }
}