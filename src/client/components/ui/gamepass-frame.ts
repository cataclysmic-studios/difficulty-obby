import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";

import { Player, PlayerGui } from "shared/utility/client";

interface Attributes {
  readonly ID: number;
}

@Component({
  tag: "GamepassFrame",
  ancestorWhitelist: [PlayerGui]
})
export class GamepassFrame extends BaseComponent<Attributes, ReplicatedFirst["Assets"]["UI"]["Purchasable"]> implements OnStart {
  public onStart(): void {
    this.instance.Icon.Image = `rbxthumb://type=GamePass&id=${this.attributes.ID}&w=150&h=150`;
    this.instance.Buy.MouseButton1Click.Connect(() => Market.PromptGamePassPurchase(Player, this.attributes.ID));
  }
}