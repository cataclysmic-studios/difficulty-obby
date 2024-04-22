import { Controller, type OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";

import { Character } from "shared/utility/client";

@Controller()
export class PlayerHidingController implements OnInit {
  public onInit(): void {
    for (const character of this.getAllCharacters())
      task.spawn(() => {
        const parts = this.getCharacterParts(character);
        for (const part of parts)
          part.SetAttribute("DefaultTransparency", part.Transparency);
      });
  }

  public toggle(on: boolean): void {
    task.spawn(() => {
      for (const character of this.getAllCharacters())
        task.spawn(() => {
          const parts = this.getCharacterParts(character);
          for (const part of parts)
            part.Transparency = on ? 1 : (<number>part.GetAttribute("DefaultTransparency") ?? 0);
        });
    });
  }

  private getCharacterParts(character: Model): BasePart[] {
    return character.GetDescendants().filter((i): i is BasePart => i.IsA("BasePart"));
  }

  private getAllCharacters() {
    return Players.GetPlayers()
      .map(player => player.Character!)
      .filter(character => character !== Character);
  }
}