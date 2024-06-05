import { Controller, OnInit, type OnRender } from "@flamework/core";
import { Workspace as World, ContentProvider } from "@rbxts/services";
import Object from "@rbxts/object-utils";

import { Events, Functions } from "client/network";
import { Player, PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { pascalCaseToSpaced, removeWhitespace } from "shared/utility/strings";
import { commaFormat } from "shared/utility/numbers";
import { type CrateName, Rarity } from "shared/structs/player-items";
import { CRATES, EMPTY_IMAGE, RARITY_COLORS, RARITY_WORTH } from "shared/constants";

import type { CameraController } from "./camera";
import type { NotificationController } from "./notification";
import SmoothValue from "shared/classes/smooth-value";

@Controller()
export class CratesController implements OnInit, OnRender {
  private readonly rewardCard = PlayerGui.OpeningCrate.RewardCard;
  private readonly fovOffset = new SmoothValue(0, 4);

  public constructor(
    private readonly camera: CameraController,
    private readonly notification: NotificationController
  ) { }

  public onInit(): void {
    ContentProvider.PreloadAsync([Assets.Crate.Animation]);
  }

  public onRender(dt: number): void {
    if (this.camera.currentName !== "Fixed") return;
    this.camera.getCurrent().instance.FieldOfView = 70 + this.fovOffset.update(dt);
  }

  public open(name: CrateName): void {
    this.toggleAllUI(false);
    const itemRarity = this.getWonRarity(name);
    const excludeTemporarily = ["Emotes"];
    const rewardFolders = Assets.CrateRewards.GetChildren().filter((i): i is RarityFolders => i.IsA("Folder") && !excludeTemporarily.includes(i.Name));
    const rewardFolder = rewardFolders[math.random(1, rewardFolders.size()) - 1];
    const items = rewardFolder[itemRarity].GetChildren();
    const item = items[math.random(1, items.size()) - 1];
    const icon = this.getItemIcon(item);
    const noIcon = removeWhitespace(icon) === "";
    const [rarityColorA, rarityColorB] = RARITY_COLORS[itemRarity];
    this.rewardCard.Title.Text = item.Name;
    this.rewardCard.ItemType.Text = pascalCaseToSpaced(item.ClassName).upper();
    this.rewardCard.UIGradient.Color = new ColorSequence([new ColorSequenceKeypoint(0, rarityColorA), new ColorSequenceKeypoint(1, rarityColorB)]);
    this.rewardCard.Icon.Image = noIcon ? EMPTY_IMAGE : icon;
    if (noIcon)
      this.compensateNoIcon(item);

    const crate = Assets.Crate.Clone();
    crate.PivotTo(World.Crates.CratePosition.CFrame);
    crate.Parent = World.Crates;
    const animation = crate.AnimationController.Animator.LoadAnimation(crate.Animation);
    animation.GetMarkerReachedSignal("ZoomIn").Once(() => this.fovOffset.setTarget(-25));
    animation.GetMarkerReachedSignal("ZoomOut").Once(() => this.fovOffset.zeroize());
    animation.GetMarkerReachedSignal("Thud1").Once(() => crate.Thud1.Play());
    animation.GetMarkerReachedSignal("Thud2").Once(() => crate.Thud2.Play());
    animation.GetMarkerReachedSignal("Slide").Once(() => crate.Slide.Play());
    animation.GetMarkerReachedSignal("Shake").Once(() => crate.Shake.Play());
    animation.GetMarkerReachedSignal("Swoosh").Once(() => crate.Swoosh.Play());
    animation.GetMarkerReachedSignal("Explode").Once(() => crate.Explode.Play());

    animation.Play();
    task.delay(animation.Length * 0.9, () => animation.Stop(5));
    this.camera.get("Fixed").setCFrame(World.Crates.CameraPart.CFrame);
    this.camera.set("Fixed");
    animation.Stopped.Wait();
    crate.Destroy();

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

          Events.data.addToArray("ownedTrails", item.Name);
          break;
        }
      }
    });
  }

  private compensateNoIcon(item: Instance): void {
    switch (item.ClassName) {
      case "Trail": {
        this.rewardCard.Icon.UIGradient.Transparency = new NumberSequence(0);
        this.rewardCard.Icon.UIGradient.Color = (<Trail>item).Color;
        break;
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