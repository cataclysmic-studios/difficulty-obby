import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";

import { Events } from "server/network";

import type { DatabaseService } from "server/services/third-party/database";

@Component({ tag: "KillPart" })
export class KillPart extends BaseComponent<{}, BasePart> implements OnStart {
  public constructor(
    private readonly db: DatabaseService
  ) { super(); }

  public onStart(): void {
    this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (character === undefined || humanoid === undefined) return;
      if (hit.FindFirstAncestorOfClass("Accessory") !== undefined) return;
      if (character.GetAttribute("KillPartDebounce") === true) return;

      const player = Players.GetPlayerFromCharacter(character);
      if (player !== undefined && this.db.isInvincible(player) && this.instance.Name !== "Void") return;
      character.SetAttribute("KillPartDebounce", true);
      task.delay(0.5, () => character?.SetAttribute("KillPartDebounce", false));

      if (player === undefined) return;
      Events.character.respawn(player);
    });
  }
}