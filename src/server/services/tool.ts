import { Service, type OnInit } from "@flamework/core";
import { Events } from "server/network";

import { Assets } from "shared/utility/instances";

import type { DatabaseService } from "./third-party/database";

@Service()
export class ToolService implements OnInit {
  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onInit(): void {
    Events.updateBackpackItems.connect(player => {
      const items = this.db.get(player, "ownedItems", []);
      player.WaitForChild("Backpack").ClearAllChildren();
      player.WaitForChild("StarterGear").ClearAllChildren();

      for (const item of items)
        this.addItemToBackpack(player, item);
    });
  }

  private addItemToBackpack(player: Player, itemName: string): void {
    const storeItem = <Tool>Assets.StoreItems.WaitForChild(itemName);
    storeItem.Clone().Parent = player.WaitForChild("Backpack");
    storeItem.Clone().Parent = player.WaitForChild("StarterGear");
  }
}