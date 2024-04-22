import { Controller } from "@flamework/core";
import { Players } from "@rbxts/services";

import { Character } from "shared/utility/client";

@Controller()
export class PlayerHidingController {
  public toggle(on: boolean): void {
    const characters = Players.GetPlayers()
      .map(player => player.Character!)
      .filter(character => character !== Character);

    const getCharacterParts = (character: Model): BasePart[] => {
      return character.GetDescendants().filter((i): i is BasePart => i.IsA("BasePart"));
    }

    task.spawn(() => {
      for (const character of characters) {
        const parts = getCharacterParts(character);
        for (const part of parts)
          part.SetAttribute("DefaultTransparency", part.Transparency);
      }

      for (const character of characters)
        task.spawn(() => {
          const parts = getCharacterParts(character);
          for (const part of parts)
            part.Transparency = on ? 1 : <number>part.GetAttribute("DefaultTransparency");
        });
    });
  }
}