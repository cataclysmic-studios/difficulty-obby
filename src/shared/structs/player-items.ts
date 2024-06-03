interface Item<Name extends string = string> {
  readonly name: Name;
  readonly icon: string;
}

export interface Booster extends Item {
  readonly length: string;
}

export const enum CrateName {
  Noob = "Noob",
  Pro = "Pro",
  Beast = "Beast"
}

export enum Rarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Epic = "Epic",
  Legendary = "Legendary",
  Mythic = "Mythic"
}

export interface Crate extends Item<CrateName> {
  readonly rarityChances: Record<Rarity, number>;
}

export const enum DailyRewardType {
  Coins = "Coins",
  Crate = "Crate",
  Skip = "Skip",
  Booster = "Booster"
}

interface DailyRewardValueTypes {
  [DailyRewardType.Coins]: number;
  [DailyRewardType.Crate]: CrateName;
  [DailyRewardType.Skip]: number;
  [DailyRewardType.Booster]: [amount: number, name: string];
}

export interface DailyReward<T extends DailyRewardType = DailyRewardType> {
  readonly type: T;
  readonly value: DailyRewardValueTypes[T];
}