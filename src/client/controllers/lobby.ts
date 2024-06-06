import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";

import { PlayerGui } from "shared/utility/client";

import type { CheckpointsController } from "./checkpoints";
import type { AtmosphereController } from "./atmosphere";

@Controller()
export class LobbyController implements OnInit {
  private readonly defaultZoneMusicVolume = Sound.ZoneMusic.Volume;

  public constructor(
    private readonly checkpoints: CheckpointsController,
    private readonly atmosphere: AtmosphereController
  ) { }

  public onInit(): void {
    this.checkpoints.inLobbyUpdated.Connect((inLobby, onlyUpdateButton) => {
      if (onlyUpdateButton) return;
      const zoneName = <TextLabel>PlayerGui.WaitForChild("Main").WaitForChild("Main").WaitForChild("StageInfo").WaitForChild("ZoneName")
      zoneName.Visible = !inLobby;
      Sound.ZoneMusic.Volume = inLobby ? 0 : this.defaultZoneMusicVolume;
      this.atmosphere.update(inLobby ? 0 : undefined);
    });
  }
}