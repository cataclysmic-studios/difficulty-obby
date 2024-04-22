import { Service } from "@flamework/core";
import { endsWith } from "@rbxts/string-utils";

import type { LogStart } from "shared/hooks";
import type { OnPlayerJoin } from "server/hooks";

import type { DatabaseService } from "./third-party/database";

@Service()
export class LeaderstatsService implements OnPlayerJoin, LogStart {
  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onPlayerJoin(player: Player): void {
    const leaderstats = new Instance("Folder");
    leaderstats.Name = "leaderstats";
    leaderstats.Parent = player;

    const coinsStat = new Instance("IntValue");
    coinsStat.Name = "Coins";
    coinsStat.Value = 0;
    coinsStat.Parent = leaderstats;

    const stageStat = new Instance("IntValue");
    stageStat.Name = "Stage";
    stageStat.Value = 0;
    stageStat.Parent = leaderstats;

    this.db.updated.Connect((p, directory, value) => {
      if (player !== p) return;
      let stat: Maybe<IntValue>;

      if (endsWith(directory, "coins"))
        stat = coinsStat;
      else if (endsWith(directory, "stage"))
        stat = stageStat;

      if (stat === undefined) return;
      stat.Value = <number>value;
    });
  }
}