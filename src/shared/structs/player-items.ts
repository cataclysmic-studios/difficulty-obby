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

interface CrateLoot {

}

export interface Crate extends Item<CrateName> {
  readonly loot: CrateLoot[]
}