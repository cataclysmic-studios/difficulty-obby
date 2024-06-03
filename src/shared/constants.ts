import { CrateName, Rarity, type Booster, type Crate } from "./structs/player-items";

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
    rarityChances: {
      [Rarity.Common]: 50,
      [Rarity.Uncommon]: 27,
      [Rarity.Rare]: 15,
      [Rarity.Epic]: 5,
      [Rarity.Legendary]: 2,
      [Rarity.Mythic]: 1
    }
  }, {
    name: CrateName.Pro,
    icon: "rbxassetid://0",
    rarityChances: {
      [Rarity.Common]: 38,
      [Rarity.Uncommon]: 32,
      [Rarity.Rare]: 15,
      [Rarity.Epic]: 8,
      [Rarity.Legendary]: 4,
      [Rarity.Mythic]: 2
    }
  }, {
    name: CrateName.Beast,
    icon: "rbxassetid://0",
    rarityChances: {
      [Rarity.Common]: 26,
      [Rarity.Uncommon]: 32,
      [Rarity.Rare]: 20,
      [Rarity.Epic]: 11,
      [Rarity.Legendary]: 7,
      [Rarity.Mythic]: 4
    }
  }
];

// in coins
export const RARITY_WORTH = {
  [Rarity.Common]: 50,
  [Rarity.Uncommon]: 60,
  [Rarity.Rare]: 100,
  [Rarity.Epic]: 140,
  [Rarity.Legendary]: 200,
  [Rarity.Mythic]: 250
}

export const EMPTY_IMAGE = "rbxassetid://5168609593";