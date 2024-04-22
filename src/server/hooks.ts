export interface OnPlayerLeave {
  onPlayerLeave(player: Player): void;
}

export interface OnPlayerJoin {
  onPlayerJoin(player: Player): void;
}

export interface OnDataUpdate {
  onDataUpdate(player: Player, directory: string, value: unknown): void;
}