import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import type { LogStart } from "shared/hooks";
import { getZoneIndex, ZONE_NAMES } from "shared/constants";
import Log from "shared/logger";

import type { ZonesController } from "./zones";
import type { CheckpointsController } from "./checkpoints";

@Controller()
export class MusicController implements OnInit, LogStart {
  private songIndex = 0;
  private zoneIndex = 0;
  private currentSong?: Sound;
  private lastZoneMusic?: Folder;

  public constructor(
    private readonly zones: ZonesController,
    private readonly checkpoints: CheckpointsController
  ) { }

  public onInit(): void {
    this.zones.changed.Connect(() => {
      if (this.currentSong === undefined)
        this.playCurrentSong();
      else
        this.currentSong.Stop();
    });
    task.delay(1, () => {
      if (this.currentSong?.IsPlaying) return;
      if (this.currentSong !== undefined) return;
      this.playCurrentSong();
    });
  }

  public async playCurrentSong(): Promise<void> {
    const zoneMusic = await this.getZoneMusic();
    if (zoneMusic === undefined)
      return this.failedToFindMusic();

    const janitor = new Janitor;
    this.currentSong = <Sound>zoneMusic.GetChildren()[this.songIndex];
    if (this.currentSong === undefined)
      return this.failedToFindSong();

    janitor.Add(this.currentSong.Ended.Once(() => this.nextSong()));
    janitor.Add(this.currentSong.Stopped.Once(() => this.nextSong()));
    this.currentSong.Play();
    Log.info(`Played song "${this.currentSong.Name}"`);
  }

  private async nextSong(): Promise<void> {
    const zoneMusic = await this.getZoneMusic();
    if (zoneMusic === undefined)
      return this.failedToFindMusic();

    if (zoneMusic !== this.lastZoneMusic)
      this.songIndex = 0;


    this.songIndex += 1
    this.songIndex %= zoneMusic.GetChildren().size();
    this.playCurrentSong();
    this.lastZoneMusic = zoneMusic;
  }

  private async getZoneMusic(): Promise<Folder> {
    const stage = this.checkpoints.getStage();
    this.zoneIndex = getZoneIndex(stage);
    const zoneName = ZONE_NAMES[this.zoneIndex];
    if (zoneName === undefined)
      return <Folder><unknown>undefined;

    return <Folder>Sound.Music.FindFirstChild(zoneName)!;
  }

  private failedToFindMusic(): void {
    Log.warning(`Failed to find music for "${ZONE_NAMES[this.zoneIndex]}" zone`);
  }

  private failedToFindSong(): void {
    Log.warning(`Failed to find song at index ${this.songIndex} in zone "${ZONE_NAMES[this.zoneIndex]}"`);
  }
}