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