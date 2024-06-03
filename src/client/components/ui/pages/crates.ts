import { Component, BaseComponent } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "client/hooks";
import { Events, Functions } from "client/network";
import { Player, PlayerGui } from "shared/utility/client";
import { ProductIDs } from "shared/structs/product-ids";

import type { CratesController } from "client/controllers/crates";
import { CrateName } from "shared/structs/player-items";

@Component({
  tag: "CratesPage",
  ancestorWhitelist: [PlayerGui]
})
export class CratesPage extends BaseComponent<{}, PlayerGui["Main"]["Crates"]> implements OnDataUpdate {
  private readonly updateJanitor = new Janitor;

  public constructor(
    private readonly crates: CratesController
  ) { super(); }

  public async onDataUpdate(directory: string, crateNames: string[]): Promise<void> {
    if (!endsWith(directory, "ownedCrates")) return;
    this.updateJanitor.Cleanup();

    const coins = <number>await Functions.data.get("coins", 0);
    const noobCrates = crateNames.filter(crate => crate === CrateName.Noob).size();
    const proCrates = crateNames.filter(crate => crate === CrateName.Pro).size();
    const beastCrates = crateNames.filter(crate => crate === CrateName.Beast).size();
    this.instance.List.Noob.Open.Title.Text = `Open ${noobCrates === 0 ? "" : `(${noobCrates})`}`;
    this.instance.List.Pro.Open.Title.Text = `Open ${proCrates === 0 ? "" : `(${proCrates})`}`;
    this.instance.List.Beast.Open.Title.Text = `Open ${beastCrates === 0 ? "" : `(${beastCrates})`}`;
    this.instance.List.Noob.Price.Text = `${this.instance.List.Noob.GetAttribute("Price")} Coins`;
    this.instance.List.Pro.Price.Text = `${this.instance.List.Pro.GetAttribute("Price")} Coins`;
    this.instance.List.Beast.Price.Text = `${this.instance.List.Beast.GetAttribute("Price")} Coins`;

    let noobDebounce = false;
    this.updateJanitor.Add(this.instance.List.Noob.Open.MouseButton1Click.Connect(() => {
      if (noobDebounce) return;
      noobDebounce = true;

      const price = <number>this.instance.List.Noob.GetAttribute("Price");
      if (noobCrates === 0 && coins < price) {
        noobDebounce = false;
        return Market.PromptProductPurchase(Player, ProductIDs.Coins100);
      }

      Events.data.decrement("coins", price);
      Events.data.deleteFromArray("ownedCrates", CrateName.Noob);
      this.crates.open(CrateName.Noob);
      noobDebounce = false
    }));

    let proDebounce = false;
    this.updateJanitor.Add(this.instance.List.Pro.Open.MouseButton1Click.Connect(() => {
      if (proDebounce) return;
      proDebounce = true;

      const price = <number>this.instance.List.Noob.GetAttribute("Price");
      if (proCrates === 0 && coins < price) {
        proDebounce = false;
        return Market.PromptProductPurchase(Player, ProductIDs.Coins250);
      }

      Events.data.decrement("coins", price);
      Events.data.deleteFromArray("ownedCrates", CrateName.Pro);
      this.crates.open(CrateName.Pro);
      proDebounce = false
    }));

    let beastDebounce = false;
    this.updateJanitor.Add(this.instance.List.Beast.Open.MouseButton1Click.Connect(() => {
      if (beastDebounce) return;
      beastDebounce = true;

      const price = <number>this.instance.List.Noob.GetAttribute("Price");
      if (beastCrates === 0 && coins < price) {
        beastDebounce = false;
        return Market.PromptProductPurchase(Player, ProductIDs.Coins250);
      }

      Events.data.decrement("coins", price);
      Events.data.deleteFromArray("ownedCrates", CrateName.Beast);
      this.crates.open(CrateName.Beast);
      beastDebounce = false
    }));
  }
}