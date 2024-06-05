import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "client/hooks";
import { Events, Functions } from "client/network";
import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { removeWhitespace } from "shared/utility/strings";
import { EMPTY_IMAGE, RARITY_COLORS } from "shared/constants";
import { Rarity } from "shared/structs/player-items";

@Component({
  tag: "TrailsPage",
  ancestorWhitelist: [PlayerGui]
})
export class TrailsPage extends BaseComponent<{}, PlayerGui["Main"]["Trails"]> implements OnDataUpdate {
  private readonly updateJanitor = new Janitor;

  public async onDataUpdate(directory: string, trailNames: string[]): Promise<void> {
    if (endsWith(directory, "equippedTrail")) {
      const trailName = <string><unknown>trailNames;
      if (trailName === undefined) return;
      for (const frame of this.instance.List.GetChildren().filter((i): i is typeof Assets.UI.Equippable => i.IsA("Frame")))
        frame.Equip.Title.Text = frame.Title.Text === trailName ? "Unequip" : "Equip";

      return;
    }

    if (!endsWith(directory, "ownedTrails")) return;
    this.updateJanitor.Cleanup();
    for (const frame of this.instance.List.GetChildren().filter((i): i is Frame => i.IsA("Frame")))
      frame.Destroy();

    for (const trailName of trailNames)
      task.spawn(async () => {
        const conn = await this.createTrailFrame(trailName);
        if (conn === undefined) return;
        this.updateJanitor.Add(conn);
      });
  }

  private async createTrailFrame(trailName: string): Promise<Maybe<RBXScriptConnection>> {
    const equippableFrame = Assets.UI.Equippable.Clone();
    const trail = Assets.CrateRewards.Trails.GetDescendants().find((i): i is Trail => i.IsA("Trail") && i.Name === trailName);
    if (trail === undefined) return;

    let debounce = false;
    const noIcon = removeWhitespace(trail.Texture) === "";
    const rarity = <Rarity>trail.Parent?.Name;
    const [rarityColorA, rarityColorB] = RARITY_COLORS[rarity];
    equippableFrame.Title.Text = trailName;
    equippableFrame.UIGradient.Color = new ColorSequence([new ColorSequenceKeypoint(0, rarityColorA), new ColorSequenceKeypoint(1, rarityColorB)]);
    equippableFrame.Icon.Image = noIcon ? EMPTY_IMAGE : trail.Texture;
    equippableFrame.Icon.UIGradient.Transparency;
    equippableFrame.Icon.UIGradient.Color = noIcon ? trail.Color : new ColorSequence(new Color3(1, 1, 1));

    const isEquipped = await Functions.data.get("equippedTrail") === trailName;
    equippableFrame.Equip.Title.Text = isEquipped ? "Unequip" : "Equip";
    const conn = equippableFrame.Equip.MouseButton1Click.Connect(async () => {
      if (debounce) return;
      debounce = true;
      task.delay(0.2, () => debounce = false);

      const unequipping = equippableFrame.Equip.Title.Text === "Unequip"
      equippableFrame.Equip.Title.Text = unequipping ? "Equip" : "Unequip";
      Events.data.set("equippedTrail", unequipping ? undefined : trailName);
    });

    equippableFrame.Parent = this.instance.List;
    return conn;
  }
}