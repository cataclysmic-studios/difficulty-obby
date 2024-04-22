import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";

import { Events } from "server/network";

@Component({ tag: "KillPart" })
export class KillPart extends BaseComponent<{}, BasePart> implements OnStart {
  public onStart(): void {
    this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (humanoid === undefined) return;

      const player = Players.GetPlayerFromCharacter(character);
      if (player === undefined) return;
      Events.respawnCharacter(player);
    });
  }
}