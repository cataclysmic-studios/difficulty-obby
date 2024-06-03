import { Controller } from "@flamework/core";
import Object from "@rbxts/object-utils";

import { Events, Functions } from "client/network";
import { Player, PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { pascalCaseToSpaced, removeWhitespace } from "shared/utility/strings";
import { type CrateName, Rarity } from "shared/structs/player-items";
import { CRATES, RARITY_WORTH } from "shared/constants";

import type { CameraController } from "./camera";
import type { NotificationController } from "./notification";
import { commaFormat } from "shared/utility/numbers";

@Controller()
export class CratesController {
  private readonly rewardCard = PlayerGui.OpeningCrate.RewardCard;

  public constructor(
    private readonly camera: CameraController,
    private readonly notification: NotificationController
  ) { }

  public open(name: CrateName): void {
    this.toggleAllUI(false);
    const itemRarity = this.getWonRarity(name);
    const rewardFolders = Assets.CrateRewards.GetChildren().filter((i): i is RarityFolders => i.IsA("Folder"));
    const rewardFolder = rewardFolders[rewardFolders.size() === 1 ? 0 : math.random(0, rewardFolders.size() - 1)];
    const items = rewardFolder[itemRarity].GetChildren();
    const item = items[items.size() === 1 ? 0 : math.random(0, items.size() - 1)];
    const icon = this.getItemIcon(item);
    const noIcon = removeWhitespace(icon) === "";
    this.rewardCard.Title.Text = item.Name;
    this.rewardCard.ItemType.Text = pascalCaseToSpaced(item.ClassName).upper();
    this.rewardCard.Icon.Image = noIcon ? "rbxassetid://5168609593" : icon;
    if (noIcon)
      this.compensateNoIcon(item);

    // set to crate camera
    // do animation
    task.wait(5); // temp
    this.toggleCrateUI(true);

    this.rewardCard.Claim.MouseButton1Click.Once(async () => {
      this.camera.set("Default");
      this.toggleCrateUI(false);
      this.toggleAllUI(true);
      switch (item.ClassName) {
        case "Trail": {
          const ownedTrails = <string[]>await Functions.data.get("ownedTrails", []);
          if (ownedTrails.includes(item.Name))
            return this.gotDuplicate(itemRarity);

          Events.data.addToArray("ownedTrails", item.Name);;
          break
        }
      }
    });
  }

  private compensateNoIcon(item: Instance): void {
    switch (item.ClassName) {
      case "Trail": {
        this.rewardCard.Icon.ImageColor3 = (<Trail>item).Color.Keypoints[0].Value;
      }

      default: break;
    }
  }

  private gotDuplicate(itemRarity: Rarity): void {
    const worth = RARITY_WORTH[itemRarity];
    Events.data.increment("coins", worth);
    return this.notification.send(`Duplicate acquired, received ${commaFormat(worth)} coins.`);
  }

  private getWonRarity(name: CrateName): Rarity {
    const crate = CRATES.find(crate => crate.name === name);
    if (crate === undefined)
      return <Rarity><unknown>Player.Kick("that is not a real crate brah"); // hack

    const randomChance = math.random() * 100;
    let cumulativeChance = 0;
    for (const rarity of Object.values(Rarity)) {
      cumulativeChance += crate.rarityChances[rarity];
      if (randomChance < cumulativeChance)
        return rarity;
    }

    return <Rarity><unknown>undefined; // hack
  }

  private getItemIcon(item: Instance): string {
    switch (item.ClassName) {
      case "Trail": return (<Trail>item).Texture;

      default: return "rbxassetid://0";
    }
  }

  private toggleAllUI(on: boolean): void {
    for (const screen of PlayerGui.GetChildren().filter((i): i is ScreenGui => i.IsA("ScreenGui"))) {
      if (screen.Name === "OpeningCrate") continue;
      screen.Enabled = on;
    }
  }

  private toggleCrateUI(on: boolean): void {
    PlayerGui.OpeningCrate.Enabled = on;
  }
}