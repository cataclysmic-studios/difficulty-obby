import { OnInit, Service } from "@flamework/core";
import { MarketplaceService as Market, Players, Lighting } from "@rbxts/services";

import type { LogStart } from "shared/hooks";
import { Events } from "server/network";
import { ProductIDs, PassIDs } from "../../shared/structs/product-ids";
import Log from "shared/logger";

import type { DatabaseService } from "./third-party/database";
import type { CharacterService } from "./character";
import { tween } from "shared/utility/ui";

type RewardHandler = (player: Player) => void;

function nuke(player: Player): void {
  Events.playSoundEffect.broadcast("NukeAlarm");
  Events.sendNotification.broadcast(`${player.Name} has sent a nuke!!!`);
  task.delay(5, () => {
    Events.playSoundEffect.broadcast("NukeFall");
    task.delay(4.5, () => {
      Events.nukeShake.broadcast();
      Events.playSoundEffect.broadcast("NukeExplode");
      Events.character.respawn.except(player, false);
      Lighting.ExposureCompensation = 4;
      tween(Lighting, new TweenInfo(10), { ExposureCompensation: 0 });
    });
  });
}

@Service()
export class TransactionsService implements OnInit, LogStart {
  private readonly rewardHandlers: Record<number, RewardHandler> = {
    [ProductIDs.Nuke]: nuke,
    [ProductIDs.SkipStage]: player => {
      this.db.increment(player, "stage");
      Events.character.respawn(player);
    },
    [ProductIDs.Coins100]: player => this.db.increment(player, "coins", 100),
    [ProductIDs.Coins250]: player => this.db.increment(player, "coins", 250),
    [ProductIDs.Coins500]: player => this.db.increment(player, "coins", 500),
    [ProductIDs.Coins1000]: player => this.db.increment(player, "coins", 1000),
    [ProductIDs.Coins1750]: player => this.db.increment(player, "coins", 1750),
    [ProductIDs.Coins4000]: player => this.db.increment(player, "coins", 4000),
    [ProductIDs.Coins10000]: player => this.db.increment(player, "coins", 10000),
    [ProductIDs.Coins25000]: player => this.db.increment(player, "coins", 25000),

    [PassIDs.InfiniteCoins]: player => this.db.set(player, "coins", math.huge),
    [PassIDs.Invincibility]: player => {
      player.SetAttribute("OwnsInvincibility", true);
      this.character.updateInvincibility(player, true);
    }
  }

  public constructor(
    private readonly db: DatabaseService,
    private readonly character: CharacterService
  ) { }

  public onInit(): void {
    let nukeDebounce = false;
    Events.nuke.connect(player => {
      if (nukeDebounce) return;
      nukeDebounce = true;
      task.delay(1, () => nukeDebounce = false);
      nuke(player);
    });

    Market.PromptGamePassPurchaseFinished.Connect((player, passID, wasPurchased) => {
      if (!wasPurchased) return;
      this.rewardHandlers[passID]?.(player);
      Events.transactions.processed(player, "GamePass", passID);
    });
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
        if (playerExists) {
          grantReward?.(player);
          Events.transactions.processed(player, "DevProduct", ProductId);
        }
      } catch (err) {
        success = false;
        purchaseRecorded = undefined;
        Log.warning(`Failed to process purchase for product ${ProductId}: ${err}`);
      }

      return Enum.ProductPurchaseDecision[(!success || purchaseRecorded === undefined) ? "NotProcessedYet" : "PurchaseGranted"];
    }
  }
}