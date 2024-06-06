import { Service, type OnInit } from "@flamework/core";

import type { LogStart } from "shared/hooks";
import { Assets } from "shared/utility/instances";
import { endsWith } from "@rbxts/string-utils";

import type { DatabaseService } from "./third-party/database";
import { Events } from "server/network";

@Service()
export class ToolService implements OnInit, LogStart {
  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onInit(): void {
    this.db.updated.Connect((player, directory) => {
      if (!endsWith(directory, "ownedItems")) return;
      this.updateBackpack(player);
    });
    Events.tools.clearBackpack.connect(player => this.clearBackpack(player));
    Events.tools.updateBackpack.connect(player => this.updateBackpack(player));
    Events.tools.addItemToBackpack.connect((player, itemName, itemList, clearFirst) => this.addItemToBackpack(player, itemName, itemList, clearFirst));
  }

  public updateBackpack(player: Player) {
    const items = this.db.get(player, "ownedItems", []);
    this.clearBackpack(player);

    for (const item of items)
      this.addItemToBackpack(player, item);
  }

  public clearBackpack(player: Player): void {
    player.WaitForChild("Backpack").ClearAllChildren();
    player.WaitForChild("StarterGear").ClearAllChildren();
    for (const i of player.Character!.GetChildren()) {
      if (!i.IsA("Tool")) continue;
      i.Destroy();
    }
  }

  public addItemToBackpack(player: Player, itemName: string, itemList: ExtractKeys<typeof Assets, Folder> = "StoreItems", clearFirst = false): void {
    if (clearFirst) {
      this.clearBackpack(player);
      do task.wait(0.1); while (player.WaitForChild("Backpack").GetChildren().size() > 0);
    }

    const storeItem = <Tool>Assets[itemList].WaitForChild(itemName);
    const clone = storeItem.Clone();
    clone.Parent = player.WaitForChild("Backpack");
    for (const child of clone.GetChildren()) {
      if (!child.IsA("Script")) continue;
      child.Enabled = true;
    }

    if (itemList !== "StoreItems") return;
    storeItem.Clone().Parent = player.WaitForChild("StarterGear");
  }
}