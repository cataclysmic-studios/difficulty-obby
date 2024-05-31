import { type OnInit, Service } from "@flamework/core";
import { endsWith, startsWith } from "@rbxts/string-utils";
import { MarketplaceService as Market, Players } from "@rbxts/services";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import type { OnPlayerJoin, OnPlayerLeave } from "server/hooks";
import { Events, Functions } from "server/network";
import { PassIDs } from "shared/structs/product-ids";
import type { ZoneName } from "shared/zones";
import Firebase from "server/firebase";

const INF_COINS = 999_999_999;
const db = new Firebase;

export const enum MultiplierType {
	Coins
}

const INITIAL_DATA = {
	stage: 0,
	coins: 0,
	ownedItems: <string[]>[],
	lastCoinRefresh: os.time(),
	dailyCoinsClaimed: <Record<ZoneName, number[]>>{},
	settings: {
		soundEffects: true,
		music: true,
		boomboxes: true,
		hidePlayers: false,
		invincibility: false
	}
};

export type PlayerData = typeof INITIAL_DATA;

@Service({ loadOrder: 0 })
export class DatabaseService implements OnInit, OnPlayerJoin, OnPlayerLeave, LogStart {
	public readonly loaded = new Signal<(player: Player) => void>;
	public readonly updated = new Signal<(player: Player, directory: string, value: unknown) => void>;
	public playerData: Record<string, PlayerData> = {};

	public onInit(): void {
		this.playerData = this.getDatabase();
		Events.data.set.connect((player, directory, value) => this.set(player, directory, value));
		Events.data.increment.connect((player, directory, amount) => this.increment(player, directory, amount));
		Events.data.decrement.connect((player, directory, amount) => this.decrement(player, directory, amount));
		Events.data.addToArray.connect((player, directory, value) => this.addToArray(player, directory, value));
		Events.data.giveCoins.connect((_, username) => {
			const player = Players.GetPlayers().find(player => player.Name === username);
			if (player === undefined) return;
			this.increment(player, "coins", 1000);
		});
		Functions.data.get.setCallback((player, directory, defaultValue) => this.get(player, directory, defaultValue));
		Functions.data.ownsInvincibility.setCallback(player => this.ownsInvincibilityPass(player));
	}

	public onPlayerJoin(player: Player): void {
		this.setup(player);
	}

	public onPlayerLeave(player: Player): void {
		db.set(`playerData/${player.UserId}`, this.getCached(player));
	}

	public get<T>(player: Player, directory: string, defaultValue?: T): T {
		let data: Record<string, unknown> = this.getCached(player);
		const pieces = directory.split("/");
		for (const piece of pieces)
			data = <Record<string, unknown>>(data ?? {})[piece];

		return <T>(data ?? defaultValue);
	}

	public set<T>(player: Player, directory: string, value: T): void {
		let data: Record<string, unknown> = this.getCached(player);
		const pieces = directory.split("/");
		const lastPiece = pieces[pieces.size() - 1];
		for (const piece of pieces) {
			if (piece === lastPiece) continue;
			data = <Record<string, unknown>>(data ?? {})[piece];
		}

		data[lastPiece] = value;
		this.update(player, this.getDirectoryForPlayer(player, directory), value);
	}

	public increment(player: Player, directory: string, amount = 1): number {
		const incrementingCoins = endsWith(directory, "coins");
		if (incrementingCoins) {
			Events.playSoundEffect(player, "GainCoins");
			const coinMultiplier = this.getMultiplier(player, MultiplierType.Coins);
			amount *= coinMultiplier;
		}

		const oldValue = this.get<number>(player, directory);
		const value = oldValue + amount;
		this.set(player, directory, value);
		return value;
	}

	public decrement(player: Player, directory: string, amount = 1): number {
		return this.increment(player, directory, -amount);
	}

	public addToArray<T extends defined = defined>(player: Player, directory: string, value: T): void {
		const array = this.get<T[]>(player, directory, []);
		array.push(value);
		this.set(player, directory, array);
	}

	public delete(player: Player, directory: string): void {
		this.set(player, directory, undefined);
	}

	public getDatabase(): Record<string, PlayerData> {
		return db.get("playerData", {});
	}

	public isInvincible(player: Player): boolean {
		return this.ownsInvincibilityPass(player) && this.get<boolean>(player, "settings/invincibility");
	}

	public ownsInvincibilityPass(player: Player): boolean {
		return <boolean>player.GetAttribute("OwnsInvincibility") || Market.UserOwnsGamePassAsync(player.UserId, PassIDs.Invincibility);
	}

	public getMultiplier(player: Player, multiplierType: MultiplierType): number {
		switch (multiplierType) {
			case MultiplierType.Coins: {
				const doubleCoins = Market.UserOwnsGamePassAsync(player.UserId, PassIDs.DoubleCoins);
				return doubleCoins ? 2 : 1;
			}
		}
	}

	private getCached(player: Player): PlayerData {
		return this.playerData[tostring(player.UserId)] ?? INITIAL_DATA;
	}

	private update(player: Player, fullDirectory: string, value: unknown): void {
		this.updated.Fire(player, fullDirectory, value);
		Events.data.updated(player, fullDirectory, value);
	}

	private setup(player: Player): void {
		const data = db.get<PlayerData>(`playerData/${player.UserId}`, table.clone(INITIAL_DATA));
		this.playerData[tostring(player.UserId)] = data;
		this.initialize(player, "stage", 0);
		this.initialize(player, "coins", 0);
		this.initialize(player, "ownedItems", []);
		this.initialize(player, "lastCoinRefresh", os.time());
		this.initialize(player, "dailyCoinsClaimed", {});
		this.initializeSettings(player);

		if (os.time() - this.get<number>(player, "lastCoinRefresh") >= 24 * 60 * 60) {
			this.delete(player, "dailyCoinsClaimed");
			this.set<number>(player, "lastCoinRefresh", os.time());
		}

		if (Market.UserOwnsGamePassAsync(player.UserId, PassIDs.InfiniteCoins) && this.get<number>(player, "coins") < INF_COINS)
			this.set(player, "coins", INF_COINS);

		this.loaded.Fire(player);
	}

	private initialize<T>(player: Player, directory: string, initialValue: T): void {
		this.set(player, directory, this.get(player, directory, initialValue));
	}

	private initializeSettings(player: Player) {
		this.initialize(player, "settings/soundEffects", true);
		this.initialize(player, "settings/music", true);
		this.initialize(player, "settings/boomboxes", true);
		this.initialize(player, "settings/hidePlayers", false);
		this.initialize(player, "settings/invincibility", false);
	}

	private getDirectoryForPlayer(player: Player, directory: string): string {
		if (startsWith(directory, `playerData/${player.UserId}/`))
			return directory;

		return `playerData/${player.UserId}/${directory}`;
	}
}