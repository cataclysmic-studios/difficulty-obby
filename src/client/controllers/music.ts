import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import type { LogStart } from "shared/hooks";
import { getZone, getZoneIndex, ZONES } from "shared/zones";
import Log from "shared/logger";

import type { ZonesController } from "./zones";
import type { CheckpointsController } from "./checkpoints";

@Controller({ loadOrder: 0 })
export class MusicController implements OnInit, LogStart {
  public currentSong?: Sound;

  private songIndex = 0;
  private zoneIndex = 0;
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

    janitor.Add(this.currentSong.Ended.Once(() => {
      janitor.Cleanup();
      this.nextSong();
    }));
    janitor.Add(this.currentSong.Stopped.Once(() => {
      janitor.Cleanup();
      this.nextSong();
    }));
    this.currentSong.Play();
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
    const { name: zoneName } = getZone(stage);
    if (zoneName === undefined)
      return <Folder><unknown>undefined;

    return <Folder>Sound.ZoneMusic.FindFirstChild(zoneName)!;
  }

  private failedToFindMusic(): void {
    Log.warning(`Failed to find music for "${ZONES[this.zoneIndex]}" zone`);
  }

  private failedToFindSong(): void {
    Log.warning(`Failed to find song at index ${this.songIndex} in zone "${ZONES[this.zoneIndex]}"`);
  }
}