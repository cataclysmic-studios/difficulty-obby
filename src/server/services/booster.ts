import { Service, type OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";

import { Events, Functions } from "server/network";
import { BOOSTERS } from "shared/constants";
import type { ActiveBooster } from "shared/data-models/player-data";

import type { DatabaseService } from "./third-party/database";
import type { SchedulingService } from "./scheduling";

const CANNOT_FIND = "ok brah that's not a real booster";

@Service()
export class BoosterService implements OnInit {
  public constructor(
    private readonly db: DatabaseService,
    private readonly scheduling: SchedulingService
  ) { }

  public onInit(): void {
    Events.useBooster.connect((player, name) => this.use(player, name));
    Events.rewardBooster.connect(player => {
      const booster = BOOSTERS[math.random(0, BOOSTERS.size() - 1)];
      this.reward(player, booster.name);
    });
    Functions.isBoosterActive.setCallback((player, name) => this.db.isBoosterActive(player, name));

    this.scheduling.every.second.Connect(() => {
      for (const player of Players.GetPlayers()) {
        const activeBoosters = this.db.get<ActiveBooster[]>(player, "activeBoosters", []);
        for (const booster of activeBoosters) {
          if (this.db.isBoosterActive(player, booster.name)) continue;
          this.db.filterFromArray<ActiveBooster>(player, "activeBoosters", b => b.name === booster.name && b.activatedTimestamp === booster.activatedTimestamp);
        }
      }
    });
  }

  public reward(player: Player, name: string): void {
    const booster = BOOSTERS.find(booster => booster.name === name);
    if (booster === undefined)
      player.Kick(CANNOT_FIND);

    this.db.addToArray<string>(player, "ownedBoosters", name);
  }

  public use(player: Player, name: string): void {
    const booster = BOOSTERS.find(booster => booster.name === name);
    if (booster === undefined)
      player.Kick(CANNOT_FIND);

    this.db.deleteFromArray(player, "ownedBoosters", name);
    this.db.addToArray<ActiveBooster>(player, "activeBoosters", {
      name,
      activatedTimestamp: os.time()
    });
  }
}