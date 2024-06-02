import { Service } from "@flamework/core";

import type { OnPlayerJoin } from "server/hooks";
import { Assets } from "shared/utility/instances";
import { DEVELOPERS } from "shared/constants";

@Service({ loadOrder: 0 })
export class NametagService implements OnPlayerJoin {
  public onPlayerJoin(player: Player): void {
    if (!DEVELOPERS.includes(player.UserId)) return;
    player.CharacterAdded.Connect(character => {
      const nametag = Assets.UI.Nametag.Clone();
      nametag.Prefix.Text = player.UserId === 95976124 ? "[Developer]" : "[Owner]";
      nametag.Adornee = <BasePart>character.WaitForChild("Head");
      nametag.Parent = character;
    });
  }
}