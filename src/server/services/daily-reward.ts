import { Service, type OnInit } from "@flamework/core";

import type { LogStart } from "shared/hooks";
import { Events } from "server/network";

import type { DatabaseService } from "./third-party/database";

const ONE_DAY = 24 * 60 * 60;

@Service()
export class DailyRewardService implements OnInit, LogStart {
  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onInit(): void {
    Events.data.updateLoginStreak.connect(player => {
      const claimedDaily = this.db.get<boolean>(player, "claimedDaily", false);
      if (claimedDaily) return;
      this.updateStreak(player);
    });

    this.db.loaded.Connect(player => {
      this.db.set(player, "lastLogin", os.time());
      this.updateStreak(player);
    });
  }

  private updateStreak(player: Player): void {
    const lastLogin = this.db.get<number>(player, "lastLogin", 0);
    if (os.time() - lastLogin < ONE_DAY)
      this.db.increment(player, "loginStreak");
    else {
      this.db.set(player, "loginStreak", 0);
      this.db.set(player, "claimedDaily", false);
    }
  }
}