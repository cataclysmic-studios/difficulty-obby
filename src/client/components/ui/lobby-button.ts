import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Workspace as World } from "@rbxts/services";

import type { OnCharacterAdd } from "shared/hooks";
import { PlayerGui } from "shared/utility/client";

import type { CharacterController } from "client/controllers/character";
import type { CheckpointsController } from "client/controllers/checkpoints";

@Component({
  tag: "LobbyButton",
  ancestorWhitelist: [PlayerGui]
})
export class LobbyButton extends BaseComponent<{}, ImageButton & { Icon: ImageLabel; }> implements OnStart, OnCharacterAdd {
  private readonly lobbyIcon = "rbxassetid://6034798461";
  private readonly obbyIcon = "rbxassetid://17748200905";

  public constructor(
    private readonly character: CharacterController,
    private readonly checkpoints: CheckpointsController
  ) { super(); }

  public onStart(): void {
    this.checkpoints.inLobbyUpdated.Connect(() => this.updateIcon());
    this.instance.MouseButton1Click.Connect(() => {
      this.checkpoints.setInLobby(!this.checkpoints.inLobby);
      if (this.checkpoints.inLobby)
        this.character.teleport(World.Lobby.Dark.SpawnLocation.CFrame);
      else
        this.checkpoints.respawn(false);
    });
  }

  public onCharacterAdd(character: CharacterModel): void {
    character.Humanoid.Died.Connect(() => this.checkpoints.setInLobby(true));
  }

  private updateIcon(): void {
    this.instance.Icon.Image = this.checkpoints.inLobby ? this.obbyIcon : this.lobbyIcon;
  }
}