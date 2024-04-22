import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { StarterPack } from "@rbxts/services";

import { Events, Functions } from "client/network";
import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { commaFormat } from "shared/utility/numbers";

import type { CharacterController } from "client/controllers/character";

@Component({
  tag: "StorePage",
  ancestorWhitelist: [PlayerGui]
})
export class StorePage extends BaseComponent<{}, PlayerGui["Main"]["Store"]> implements OnStart {
  public constructor(
    private readonly character: CharacterController
  ) { super(); }

  public async onStart(): Promise<void> {
    const storeItems = <Tool[]>Assets.StoreItems.GetChildren();
    for (const storeItem of storeItems)
      this.createShopItemFrame(storeItem);
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

  private createShopItemFrame(storeItem: Tool): void {
    const purchasableFrame = Assets.UI.Purchasable.Clone();
    purchasableFrame.Title.Text = storeItem.Name;
    purchasableFrame.Icon.Image = <string>storeItem.GetAttribute("Icon");
    purchasableFrame.Parent = this.instance.List;

    const price = <number>storeItem.GetAttribute("Price");
    const priceLabel = Assets.UI.Price.Clone();
    priceLabel.Text = `${commaFormat(price)} Coins`;

    let debounce = false
    purchasableFrame.Buy.MouseButton1Click.Connect(async () => {
      if (debounce) return;
      debounce = true;
      task.delay(0.75, () => debounce = false);

      const coins = <number>await Functions.data.get("coins");
      if (coins < price) return;
      Events.data.decrement("coins", price);

      storeItem.Clone().Parent = this.character.get();
      storeItem.Clone().Parent = StarterPack;
    });
  }
}