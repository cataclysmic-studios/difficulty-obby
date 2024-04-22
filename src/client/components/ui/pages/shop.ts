import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";

import { Functions } from "client/network";
import { Player, PlayerGui } from "shared/utility/client";
import { Assets, getDevProducts, type DevProductInfo } from "shared/utility/instances";
import type { GamepassInfo } from "shared/structs/roblox-api";

@Component({
  tag: "ShopPage",
  ancestorWhitelist: [PlayerGui]
})
export class ShopPage extends BaseComponent<{}, PlayerGui["Main"]["Shop"]> implements OnStart {
  public async onStart(): Promise<void> {
    const devProducts = getDevProducts().sort((productA, productB) => this.sortPurchasables(productA.Name, productB.Name));
    const gamepasses = (await Functions.roblox.getGamepasses()).sort((passA, passB) => this.sortPurchasables(passA.name, passB.name));
    for (const gamepass of gamepasses)
      this.createGamepassFrame(gamepass);
    for (const product of devProducts)
      this.createDevProductFrame(product);
  }

  private createGamepassFrame({ name, id }: GamepassInfo): void {
    const purchasableFrame = Assets.UI.Purchasable.Clone();
    purchasableFrame.Title.Text = name;
    purchasableFrame.Buy.MouseButton1Click.Connect(() => Market.PromptGamePassPurchase(Player, id));
    purchasableFrame.Parent = this.instance.List;
  }

  private createDevProductFrame({ Name, ProductId }: DevProductInfo): void {
    const purchasableFrame = Assets.UI.Purchasable.Clone();
    purchasableFrame.Title.Text = Name;
    purchasableFrame.Buy.MouseButton1Click.Connect(() => Market.PromptProductPurchase(Player, ProductId));
    purchasableFrame.Parent = this.instance.List;
  }

  private sortPurchasables(nameA: string, nameB: string): boolean {
    const getCurrencyAmount = (productName: string): number => {
      return tonumber(productName.gsub(",", "")[0].split(" ")[0])!;
    };

    const amountA = getCurrencyAmount(nameA);
    const amountB = getCurrencyAmount(nameB);
    return amountA !== undefined && amountB !== undefined ?
      amountA < amountB
      : nameA > nameB;
  }
}