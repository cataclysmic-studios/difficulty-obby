import { Service } from "@flamework/core";
import { endsWith } from "@rbxts/string-utils";

import type { LogStart } from "shared/hooks";
import type { OnPlayerJoin } from "server/hooks";
import { Events } from "server/network";

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

    const stageStat = new Instance("IntValue");
    stageStat.Name = "Stage";
    stageStat.Value = 0;
    stageStat.Parent = leaderstats;

    const coinsStat = new Instance("IntValue");
    coinsStat.Name = "Coins";
    coinsStat.Value = 0;
    coinsStat.Parent = leaderstats;

    Events.stageOffsetUpdated.connect((p, stage, advancing) => {
      if (player !== p) return;
      stageStat.Value = stage;

      if (advancing) return;
      Events.character.respawn(player, false);
    });
    this.db.updated.Connect((p, directory, value) => {
      if (player !== p) return;
      let stat: Maybe<IntValue>;

      if (endsWith(directory, "coins"))
        stat = coinsStat;

      if (stat === undefined) return;
      stat.Value = <number>value;
    });
  }

  public getValue<T>(player: Player, statName: string): T {
    const leaderstats = player.WaitForChild("leaderstats");
    return <T>(<ValueBase>leaderstats.WaitForChild(statName)).Value;
  }
}