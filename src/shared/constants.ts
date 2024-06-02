import type { Booster } from "./structs/boosters";

export const CREATOR_ID = game.CreatorType === Enum.CreatorType.User ? game.CreatorId : 44966864; // add your user ID here if you're the creator
export const DEVELOPERS = [CREATOR_ID, 101313060, 95976124]; // add extra developer user IDs here

export const BOOSTERS: Booster[] = [
  {
    name: "Double Coins",
    length: "10 minutes",
    icon: "rbxassetid://17703681433"
  }
]