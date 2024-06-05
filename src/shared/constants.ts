import { CrateName, DailyReward, DailyRewardType, Rarity, type Booster, type Crate } from "./structs/player-items";

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

export const DAILY_REWARDS: (DailyReward | DailyReward[])[] = [
  { // 1
    type: DailyRewardType.Coins,
    value: 50
  }, { // 2
    type: DailyRewardType.Skip,
    value: 3
  }, { // 3
    type: DailyRewardType.Crate,
    value: CrateName.Noob
  }, { // 4
    type: DailyRewardType.Booster,
    value: [2, "Double Coins"]
  }, [{ // 5
    type: DailyRewardType.Coins,
    value: 125
  }, {
    type: DailyRewardType.Skip,
    value: 1
  }], [{
    type: DailyRewardType.Crate,
    value: CrateName.Pro
  }, { // 4
    type: DailyRewardType.Booster,
    value: [1, "Double Coins"]
  }], [{
    type: DailyRewardType.Crate,
    value: CrateName.Beast
  }, { // 4
    type: DailyRewardType.Coins,
    value: 75
  }]
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

export const RARITY_COLORS = {
  [Rarity.Common]: [Color3.fromRGB(130, 130, 130), Color3.fromRGB(255, 255, 255)],
  [Rarity.Uncommon]: [Color3.fromRGB(0, 255, 0), Color3.fromRGB(0, 255, 145)],
  [Rarity.Rare]: [Color3.fromRGB(0, 0, 255), Color3.fromRGB(0, 144, 255)],
  [Rarity.Epic]: [Color3.fromRGB(255, 0, 255), Color3.fromRGB(131, 0, 255)],
  [Rarity.Legendary]: [Color3.fromRGB(255, 191, 0), Color3.fromRGB(255, 229, 0)],
  [Rarity.Mythic]: [Color3.fromRGB(0, 255, 229), Color3.fromRGB(225, 0, 208)]
};

export const EMPTY_IMAGE = "rbxassetid://5168609593";