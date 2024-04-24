import { Service } from "@flamework/core";
import { endsWith } from "@rbxts/string-utils";

import type { LogStart } from "shared/hooks";
import type { OnPlayerJoin } from "server/hooks";
import { Events } from "server/network";

import type { DatabaseService } from "./third-party/database";

@Service()
export class LeaderstatsService implements OnPlayerJoin, LogStart {
  private readonly leaderstats = new Instance("Folder");

  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onPlayerJoin(player: Player): void {
    this.leaderstats.Name = "leaderstats";
    this.leaderstats.Parent = player;

    const stageStat = new Instance("IntValue");
    stageStat.Name = "Stage";
    stageStat.Value = 0;
    stageStat.Parent = this.leaderstats;

    const coinsStat = new Instance("IntValue");
    coinsStat.Name = "Coins";
    coinsStat.Value = 0;
    coinsStat.Parent = this.leaderstats;

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

  public getValue<T>(statName: string): T {
    return <T>(<ValueBase>this.leaderstats.WaitForChild(statName)).Value;
  }
}