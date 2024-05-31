import type { ZoneName } from "shared/zones";

export const INITIAL_DATA = {
  stage: 0,
  coins: 0,
  ownedItems: <string[]>[],
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