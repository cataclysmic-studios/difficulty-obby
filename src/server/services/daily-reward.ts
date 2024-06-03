import { Service } from "@flamework/core";

import type { OnPlayerJoin } from "server/hooks";

import type { DatabaseService } from "./third-party/database";

@Service()
export class DailyRewardService implements OnPlayerJoin {
  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onPlayerJoin(player: Player): void {
    const lastLogin = this.db.get<number>(player, "lastLogin", 0);
    if (os.time() - lastLogin < 24 * 60 * 60)
      this.db.increment(player, "loginStreak");
    else
      this.db.set(player, "loginStreak", 0);

    this.db.set(player, "lastLogin", os.time());
  }
}