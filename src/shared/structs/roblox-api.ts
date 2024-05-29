export interface GamepassInfo {
  readonly displayName: string;
  readonly id: number;
  readonly isOwned: boolean;
  readonly name: string;
  readonly price: number;
  readonly productId: number;
  readonly sellerId?: number;
  readonly sellerName: string;
}