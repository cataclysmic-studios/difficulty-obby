import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { Functions } from "client/network";
import { STAGES_PER_ZONE, ZONE_INFO } from "shared/constants";

@Controller()
export class MusicController implements OnInit, LogStart {
  private songIndex = 0;
  private currentSong!: Sound;
  private lastZoneMusic?: Folder;

  public onInit(): void {
    this.playCurrentSong();
  }

  public async playCurrentSong(): Promise<void> {
    const zoneMusic = await this.getZoneMusic();
    this.currentSong = <Sound>zoneMusic.GetChildren()[this.songIndex];
    this.currentSong.Ended.Once(() => this.nextSong());
    this.currentSong.Play();
  }

  private async nextSong(): Promise<void> {
    const zoneMusic = await this.getZoneMusic();
    if (zoneMusic !== this.lastZoneMusic)
      this.songIndex = 0;

    this.songIndex += 1
    this.songIndex %= zoneMusic.GetChildren().size();
    this.playCurrentSong();
    this.lastZoneMusic = zoneMusic;
  }

  private async getZoneMusic(): Promise<Folder> {
    const zoneNumber = math.floor(<number>await Functions.data.get("stage") / (STAGES_PER_ZONE + 1));
    const zoneName = ZONE_INFO[zoneNumber];
    return <Folder>Sound.Music.FindFirstChild(zoneName)!;
  }
}