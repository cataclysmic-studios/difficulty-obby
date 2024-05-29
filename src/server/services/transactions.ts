import { OnInit, Service } from "@flamework/core";
import { MarketplaceService as Market, Players } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { Events } from "server/network";
import Log from "shared/logger";

import type { DatabaseService } from "./third-party/database";

type RewardHandler = (player: Player) => void;
export const enum ProductIDs {
  Coins10000 = 1813571859,
  Coins1750 = 1813571860,
  Coins4000 = 1813571861,
  Coins500 = 1813571862,
  Coins25000 = 1813571863,
  Coins250 = 1813571864,
  Coins100 = 1813571865,
  Coins1000 = 1813571866,
  SkipStage = 1814214080,
  Nuke = 1837958289
}

export const enum PassIDs {
  Boombox = 823037548,
  DoubleCoins = 823062462,
  InfiniteCoins = 793370149,
  Invincibility = 822986586
}

@Service()
export class TransactionsService implements OnInit, LogStart {
  private readonly rewardHandlers: Record<number, RewardHandler> = {
    [ProductIDs.Coins100]: player => this.db.increment(player, "coins", 100),
    [ProductIDs.Coins250]: player => this.db.increment(player, "coins", 250),
    [ProductIDs.Coins500]: player => this.db.increment(player, "coins", 500),
    [ProductIDs.Coins1000]: player => this.db.increment(player, "coins", 1000),
    [ProductIDs.Coins1750]: player => this.db.increment(player, "coins", 1750),
    [ProductIDs.Coins4000]: player => this.db.increment(player, "coins", 4000),
    [ProductIDs.Coins10000]: player => this.db.increment(player, "coins", 10000),
    [ProductIDs.Coins25000]: player => this.db.increment(player, "coins", 25000),
    [ProductIDs.SkipStage]: player => {
      this.db.increment(player, "stage");
      Events.character.respawn(player);
    },

    [PassIDs.InfiniteCoins]: player => this.db.set(player, "coins", math.huge),
  }

  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onInit(): void {
    Market.ProcessReceipt = ({ PlayerId, ProductId, PurchaseId }) => {
      const productKey = `${PlayerId}_${PurchaseId}`;
      const player = Players.GetPlayerByUserId(PlayerId);
      const playerExists = player !== undefined;
      let purchaseRecorded: Maybe<boolean> = true;
      if (playerExists) {
        const purchaseHistory = this.db.get<string[]>(player, "purchaseHistory", []);
        const alreadyPurchased = purchaseHistory.includes(productKey);
        if (alreadyPurchased)
          return Enum.ProductPurchaseDecision.PurchaseGranted;
      } else
        purchaseRecorded = undefined;

      let success = true;
      try {
        const grantReward = this.rewardHandlers[ProductId];
        if (playerExists && grantReward !== undefined)
          grantReward(player);
      } catch (err) {
        success = false;
        purchaseRecorded = undefined;
        Log.warning(`Failed to process purchase for product ${ProductId}: ${err}`);
      }

      return Enum.ProductPurchaseDecision[(!success || purchaseRecorded === undefined) ? "NotProcessedYet" : "PurchaseGranted"];
    }
  }
}