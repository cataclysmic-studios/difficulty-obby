import type { ZoneName } from "shared/zones";

export interface ActiveBooster {
  readonly name: string;
  readonly activatedTimestamp: number;
}

export const INITIAL_DATA = {
  stage: 0,
  coins: 0,
  ownedItems: <string[]>[],
  ownedBoosters: <string[]>[],
  activeBoosters: <ActiveBooster[]>[],
  lastCoinRefresh: os.time(),
  dailyCoinsClaimed: <Record<ZoneName, number[]>>{},
  skipCredits: 0,
  settings: {
    soundEffects: true,
    music: true,
    boomboxes: true,
    hidePlayers: false,
    invincibility: false
  }
};

export type PlayerData = typeof INITIAL_DATA;