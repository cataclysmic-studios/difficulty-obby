import { Controller } from "@flamework/core";
import { Player } from "shared/utility/client";

interface CharacterModel extends Model {
  PrimaryPart: Part;
  Humanoid: Humanoid;
}

@Controller()
export class CharacterController {
  public get(): Maybe<CharacterModel> {
    return <Maybe<CharacterModel>>Player.Character;
  }
}