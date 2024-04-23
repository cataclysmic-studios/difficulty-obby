import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { endsWith } from "@rbxts/string-utils";
import Signal from "@rbxts/signal";

import { Events, Functions } from "client/network";
import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { commaFormat } from "shared/utility/numbers";

@Component({
  tag: "StorePage",
  ancestorWhitelist: [PlayerGui]
})
export class StorePage extends BaseComponent<{}, PlayerGui["Main"]["Store"]> implements OnStart {
  public readonly itemPurchased = new Signal<(purchasedItem: String) => void>;

  public async onStart(): Promise<void> {
    const storeItems = <Tool[]>Assets.StoreItems.GetChildren();
    for (const storeItem of storeItems)
      this.createShopItemFrame(storeItem);

    Events.data.updated.connect(async directory => {
      if (!endsWith(directory, "ownedItems")) return;
      Events.updateBackpackItems();
    });
  }

  public toggle(on: boolean): void {
    const screen = this.instance.FindFirstAncestorOfClass("ScreenGui")!;
    const frames = screen.GetChildren().filter((i): i is Frame => i.IsA("Frame"));

    this.instance.Visible = on;
    for (const frame of frames) {
      if (frame === this.instance) continue;
      frame.Visible = !on;
    }
  }

  private async createShopItemFrame(storeItem: Tool): Promise<void> {
    const purchasableFrame = Assets.UI.Purchasable.Clone();
    purchasableFrame.Title.Text = storeItem.Name;
    purchasableFrame.Icon.Image = <string>storeItem.GetAttribute("Icon");
    purchasableFrame.Parent = this.instance.List;

    const price = <number>storeItem.GetAttribute("Price");
    const priceLabel = Assets.UI.Price.Clone();
    priceLabel.Text = `${commaFormat(price)} Coins`;

    const ownedItems = <string[]>await Functions.data.get("ownedItems", []);
    purchasableFrame.Buy.Title.Text = ownedItems.includes(storeItem.Name) ? "Owned" : "Buy";

    let debounce = false;
    purchasableFrame.Buy.MouseButton1Click.Connect(async () => {
      if (debounce) return;
      debounce = true;
      task.delay(0.75, () => debounce = false);

      const coins = <number>await Functions.data.get("coins");
      if (coins < price) return;
      const ownedItems = <string[]>await Functions.data.get("ownedItems", []);
      if (ownedItems.includes(storeItem.Name)) return;
      Events.data.decrement("coins", price);
      Events.data.addToArray("ownedItems", storeItem.Name);
      purchasableFrame.Buy.Title.Text = "Owned";
      this.itemPurchased.Fire(storeItem.Name);
    });
  }
}