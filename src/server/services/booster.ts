import { Service, type OnInit } from "@flamework/core";
import { Events, Functions } from "server/network";
import { BOOSTERS } from "shared/constants";
import type { ActiveBooster } from "shared/data-models/player-data";

import type { DatabaseService } from "./third-party/database";

@Service()
export class BoosterService implements OnInit {
  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onInit(): void {
    Events.useBooster.connect((player, name) => this.use(player, name));
    Functions.isBoosterActive.setCallback((player, name) => this.isActive(player, name))
  }

  public use(player: Player, name: string): void {
    const booster = BOOSTERS.find(booster => booster.name === name);
    if (booster === undefined)
      player.Kick("ok brah that's not a real booster");

    this.db.deleteFromArray(player, "ownedBoosters", name);
    this.db.addToArray<ActiveBooster>(player, "activeBoosters", {
      name,
      activatedTimestamp: os.time()
    });
  }

  public isActive(player: Player, name: string): boolean {
    return this.db.get<ActiveBooster[]>(player, "activeBoosters", []).map(booster => booster.name).includes(name);
  }
}