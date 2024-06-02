import { Component, BaseComponent } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "client/hooks";
import { Events } from "client/network";
import { Player, PlayerGui } from "shared/utility/client";
import { ProductIDs } from "shared/structs/product-ids";

import type { CratesController } from "client/controllers/crates";

@Component({
  tag: "CratesPage",
  ancestorWhitelist: [PlayerGui]
})
export class CratesPage extends BaseComponent<{}, PlayerGui["Main"]["Crates"]> implements OnDataUpdate {
  private readonly updateJanitor = new Janitor;

  public constructor(
    private readonly crates: CratesController
  ) { super(); }

  public onDataUpdate(directory: string, crateNames: string[]): void {
    if (!endsWith(directory, "ownedCrates")) return;
    this.updateJanitor.Cleanup();

    const noobCrates = crateNames.filter(crate => crate === "Noob").size();
    const proCrates = crateNames.filter(crate => crate === "Pro").size();
    const beastCrates = crateNames.filter(crate => crate === "Beast").size();
    this.instance.List.Noob.Open.Title.Text = `Open ${noobCrates === 0 ? "" : `(${noobCrates})`}`;
    this.instance.List.Pro.Open.Title.Text = `Open ${proCrates === 0 ? "" : `(${proCrates})`}`;
    this.instance.List.Beast.Open.Title.Text = `Open ${beastCrates === 0 ? "" : `(${beastCrates})`}`;

    let noobDebounce = false;
    this.updateJanitor.Add(this.instance.List.Noob.Open.MouseButton1Click.Connect(() => {
      if (noobDebounce) return;
      noobDebounce = true;
      if (noobCrates === 0) {
        noobDebounce = false;
        return Market.PromptProductPurchase(Player, ProductIDs.Coins100);
      }

      Events.data.deleteFromArray("ownedCrates", "Noob");
      this.crates.open("Noob");
      noobDebounce = false
    }));

    let proDebounce = false;
    this.updateJanitor.Add(this.instance.List.Pro.Open.MouseButton1Click.Connect(() => {
      if (proDebounce) return;
      proDebounce = true;
      if (proCrates === 0) {
        proDebounce = false;
        return Market.PromptProductPurchase(Player, ProductIDs.Coins250);
      }

      Events.data.deleteFromArray("ownedCrates", "Pro");
      this.crates.open("Pro");
      proDebounce = false
    }));

    let beastDebounce = false;
    this.updateJanitor.Add(this.instance.List.Beast.Open.MouseButton1Click.Connect(() => {
      if (beastDebounce) return;
      beastDebounce = true;
      if (beastCrates === 0) {
        beastDebounce = false;
        return Market.PromptProductPurchase(Player, ProductIDs.Coins250);
      }

      Events.data.deleteFromArray("ownedCrates", "Beast");
      this.crates.open("Beast");
      beastDebounce = false
    }));
  }
}