import { CrateName, type Booster, type Crate } from "./structs/player-items";

export const CREATOR_ID = game.CreatorType === Enum.CreatorType.User ? game.CreatorId : 44966864; // add your user ID here if you're the creator
export const DEVELOPERS = [CREATOR_ID, 101313060, 95976124]; // add extra developer user IDs here

export const BOOSTERS: Booster[] = [
  {
    name: "Double Coins",
    length: "10 minutes",
    icon: "rbxassetid://17703681433"
  }
]

export const CRATES: Crate[] = [
  {
    name: CrateName.Noob,
    icon: "rbxassetid://0",
    loot: [

    ]
  }, {
    name: CrateName.Pro,
    icon: "rbxassetid://0",
    loot: [

    ]
  }, {
    name: CrateName.Beast,
    icon: "rbxassetid://0",
    loot: [

    ]
  }
];