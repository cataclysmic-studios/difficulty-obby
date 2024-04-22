import { Controller, type OnInit, type OnStart } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import type { LogStart } from "shared/hooks";
import { Events, Functions } from "client/network";
import { getZoneIndex, ZONE_INFO } from "shared/constants";
import Log from "shared/logger";

import type { ZonesController } from "./zones";

@Controller()
export class MusicController implements OnInit, OnStart, LogStart {
  private songIndex = 0;
  private zoneIndex = 0;
  private currentSong!: Sound;
  private lastZoneMusic?: Folder;

  public constructor(
    private readonly zones: ZonesController
  ) { }

  public onInit(): void {
    let firstZoneUpdate = true
    this.zones.discovered.Connect(() => {
      if (firstZoneUpdate) return;
      firstZoneUpdate = false;
      this.currentSong.Stop();
    });
  }

  public onStart(): void {
    this.playCurrentSong();
  }

  public async playCurrentSong(): Promise<void> {
    const zoneMusic = await this.getZoneMusic();
    if (zoneMusic === undefined)
      return this.failedToFindMusic();

    const janitor = new Janitor;
    this.currentSong = <Sound>zoneMusic.GetChildren()[this.songIndex];
    janitor.Add(this.currentSong.Ended.Once(() => this.nextSong()));
    janitor.Add(this.currentSong.Stopped.Once(() => this.nextSong()));
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
    const stage = <number>await Functions.data.get("stage");
    this.zoneIndex = getZoneIndex(stage);
    const zoneName = ZONE_INFO[this.zoneIndex];
    if (zoneName === undefined)
      return <Folder><unknown>undefined;

    return <Folder>Sound.Music.FindFirstChild(zoneName)!;
  }

  private failedToFindMusic(): void {
    Log.warning(`Failed to find music for "${ZONE_INFO[this.zoneIndex]}" zone`);
  }
}