import { Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { endsWith } from "@rbxts/string-utils";

import type { OnDataUpdate } from "server/hooks";
import type { LogStart, OnCharacterAdd } from "shared/hooks";
import { Assets } from "shared/utility/instances";

@Service()
export class TrailService implements OnCharacterAdd, OnDataUpdate, LogStart {
  public onCharacterAdd(character: CharacterModel): void {
    const a0 = new Instance("Attachment", character.Torso);
    a0.Name = "Attachment0";
    a0.Position = new Vector3(0, 1, 0);
    const a1 = new Instance("Attachment", character.Torso);
    a1.Name = "Attachment1";
    a1.Position = new Vector3(0, -1, 0);
  }

  public onDataUpdate(player: Player, directory: string, equippedTrail: string): void {
    if (!endsWith(directory, "equippedTrail")) return;
    if (player.Character === undefined && Players.GetPlayers().includes(player))
      player.CharacterAdded.Wait();

    const character = <CharacterModel>player.Character;
    const trail = Assets.CrateRewards.Trails.GetDescendants().find((i): i is Trail => i.IsA("Trail") && i.Name === equippedTrail)?.Clone();
    if (trail === undefined) return;

    const a0 = <Attachment>character.Torso.WaitForChild("Attachment0", 5);
    const a1 = <Attachment>character.Torso.WaitForChild("Attachment1", 5);
    if (a0 === undefined || a1 === undefined) return;

    character.Torso.FindFirstChildOfClass("Trail")?.Destroy();
    trail.Parent = character.Torso;
    trail.Attachment0 = a0;
    trail.Attachment1 = a1;
  }
}