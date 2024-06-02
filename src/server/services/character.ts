import { Service, type OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import type { OnCharacterAdd } from "shared/hooks";
import { Events } from "server/network";

import type { DatabaseService } from "./third-party/database";

@Service()
export class CharacterService implements OnInit, OnCharacterAdd {
  public constructor(
    private readonly db: DatabaseService
  ) { }

  public onInit(): void {
    Events.character.toggleDefaultMovement.connect((player, on) => this.toggleDefaultMovement(player, on));
    this.db.updated.Connect((player, directory, value) => {
      if (!endsWith(directory, "settings/invincibility")) return;
      this.updateInvincibility(player, false, <boolean>value);
    });
  }

  public onCharacterAdd(character: CharacterModel): void {
    const player = Players.GetPlayerFromCharacter(character)!;
    this.updateInvincibility(player);
  }

  public updateInvincibility(player: Player, justPurchased = false, settingOverride?: boolean): void {
    const humanoid = (player.Character ?? player.CharacterAdded.Wait()[0]).FindFirstChildOfClass("Humanoid");
    if (humanoid === undefined) return;

    const ownsPass = justPurchased || this.db.ownsInvincibilityPass(player);
    const enabled = ownsPass && (settingOverride ?? this.db.get<boolean>(player, "settings/invincibility"));
    humanoid.Health = enabled ? math.huge : 100;
    humanoid.MaxHealth = enabled ? math.huge : 100;
  }

  public toggleDefaultMovement(player: Player, on: boolean): void {
    player.DevComputerMovementMode = on ? Enum.DevComputerMovementMode.KeyboardMouse : Enum.DevComputerMovementMode.Scriptable;
    player.DevTouchMovementMode = on ? Enum.DevTouchMovementMode.DynamicThumbstick : Enum.DevTouchMovementMode.Scriptable;
    player.DevEnableMouseLock = true;
  }
}