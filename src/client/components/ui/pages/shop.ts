import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";

import { Player, PlayerGui } from "shared/utility/client";
import { Assets, getDevProducts, type DevProductInfo } from "shared/utility/instances";

@Component({
  tag: "ShopPage",
  ancestorWhitelist: [PlayerGui]
})
export class ShopPage extends BaseComponent<{}, PlayerGui["Main"]["Shop"]> implements OnStart {
  public async onStart(): Promise<void> {
    const devProducts = getDevProducts().sort((productA, productB) => this.sortPurchasables(productA.Name, productB.Name));
    for (const product of devProducts)
      this.createDevProductFrame(product);
  }

  private createDevProductFrame({ Name, ProductId, IconImageAssetId }: DevProductInfo): void {
    const purchasableFrame = Assets.UI.Purchasable.Clone();
    purchasableFrame.Title.Text = Name;
    purchasableFrame.Icon.Image = `rbxassetid://${IconImageAssetId}`;
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