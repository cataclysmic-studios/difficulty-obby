import { Service, type OnInit } from "@flamework/core";

import type { LogStart } from "shared/hooks";
import { Assets } from "shared/utility/instances";
import { endsWith } from "@rbxts/string-utils";

import type { DatabaseService } from "./third-party/database";

@Service()
export class ToolService implements OnInit, LogStart {
  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onInit(): void {
    this.db.updated.Connect((player, directory) => {
      if (!endsWith(directory, "ownedItems")) return;
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