import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import type { LogStart } from "shared/hooks";
import Log from "shared/logger";

import type { CheckpointsController } from "./checkpoints";

@Controller({ loadOrder: 0 })
export class LobbyMusicController implements OnInit, LogStart {
  public currentSong?: Sound;

  private songIndex = 0;

  public constructor(
    private readonly checkpoints: CheckpointsController
  ) { }

  public onInit(): void {
    this.checkpoints.inLobbyUpdated.Connect((inLobby, onlyUpdateButton) => {
      if (onlyUpdateButton) return;
      if (inLobby && !this.currentSong?.IsPlaying)
        this.playCurrentSong();
      else
        this.currentSong?.Stop();
    });
  }

  public async playCurrentSong(): Promise<void> {
    const janitor = new Janitor;
    this.currentSong = <Sound>Sound.LobbyMusic.GetChildren()[this.songIndex];
    if (this.currentSong === undefined)
      return this.failedToFindSong();

    janitor.Add(this.currentSong.Ended.Once(() => {
      janitor.Cleanup();
      this.nextSong();
    }));
    this.currentSong.Play();
  }

  private async nextSong(): Promise<void> {
    this.songIndex += 1
    this.songIndex %= Sound.LobbyMusic.GetChildren().size();
    this.playCurrentSong();
  }

  private failedToFindSong(): void {
    Log.warning(`Failed to find lobby song at index ${this.songIndex}`);
  }
}