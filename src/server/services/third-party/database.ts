import { type OnInit, Service } from "@flamework/core";
import { endsWith, startsWith } from "@rbxts/string-utils";
import { MarketplaceService as Market } from "@rbxts/services";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import { Events, Functions } from "server/network";
import { PassIDs } from "../../../shared/structs/product-ids";
import Firebase from "server/firebase";
import Log from "shared/logger";

const INF_COINS = 999_999_999;
const db = new Firebase;

export const enum MultiplierType {
	Coins
}

@Service({ loadOrder: 0 })
export class DatabaseService implements OnInit, LogStart {
	public readonly loaded = new Signal<(player: Player) => void>;
	public readonly updated = new Signal<(player: Player, directory: string, value: unknown) => void>;

	public onInit(): void {
		Events.data.set.connect((player, directory, value) => this.set(player, directory, value));
		Events.data.increment.connect((player, directory, amount) => this.increment(player, directory, amount))
		Events.data.decrement.connect((player, directory, amount) => this.decrement(player, directory, amount))
		Events.data.addToArray.connect((player, directory, value) => this.addToArray(player, directory, value))
		Functions.data.initialize.setCallback((player) => this.setup(player));
		Functions.data.get.setCallback((player, directory, defaultValue) => this.get(player, directory, defaultValue));
		Functions.data.ownsInvincibility.setCallback(player => this.ownsInvincibilityPass(player));
	}

	public get<T>(player: Player, directory: string, defaultValue?: T): T {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		return db.get(fullDirectory) ?? <T>defaultValue;
	}

	public set<T>(player: Player, directory: string, value: T, onlyUpdate = false): void {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		if (!onlyUpdate)
			db.set(fullDirectory, value);

		this.update(player, fullDirectory, value);
	}

	public increment(player: Player, directory: string, amount = 1): number {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		const incrementingCoins = endsWith(directory, "coins");
		if (incrementingCoins) {
			const coinMultiplier = this.getMultiplier(player, MultiplierType.Coins);
			amount *= coinMultiplier;
		}

		const value = db.increment(fullDirectory, amount);
		if (incrementingCoins)
			Events.playSoundEffect(player, "GainCoins");

		this.update(player, fullDirectory, value);
		return value;
	}

	public decrement(player: Player, directory: string, amount = 1): number {
		return this.increment(player, directory, -amount);
	}

	public addToArray<T extends defined = defined>(player: Player, directory: string, value: T): void {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		db.addToArray(fullDirectory, value);
		this.update(player, fullDirectory, value);
	}

	public delete(player: Player, directory: string): void {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		db.delete(fullDirectory);
		this.update(player, fullDirectory, undefined);
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

	private update(player: Player, fullDirectory: string, value: unknown): void {
		this.updated.Fire(player, fullDirectory, value);
		Events.data.updated(player, fullDirectory, value);
	}

	private setup(player: Player): void {
		this.initialize(player, "", {
			stage: 0,
			coins: 0,
			ownedItems: [],
			lastCoinRefresh: os.time(),
			dailyCoinsClaimed: {},
			settings: {
				soundEffects: true,
				music: true,
				boomboxes: true,
				hidePlayers: false,
				invincibility: false
			}
		});

		if (os.time() - this.get<number>(player, "lastCoinRefresh") >= 24 * 60 * 60) {
			this.delete(player, "dailyCoinsClaimed");
			this.set<number>(player, "lastCoinRefresh", os.time());
		}

		if (Market.UserOwnsGamePassAsync(player.UserId, PassIDs.InfiniteCoins) && this.get<number>(player, "coins") < INF_COINS)
			this.set(player, "coins", INF_COINS);

		this.loaded.Fire(player);
		Log.info("Initialized data");
	}

	private initialize<T>(player: Player, directory: string, initialValue: T): void {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		const value = db.get<Maybe<T>>(fullDirectory) ?? initialValue;
		this.set(player, directory, value, value !== initialValue);
	}

	private getDirectoryForPlayer(player: Player, directory: string): string {
		if (startsWith(directory, `playerData/${player.UserId}/`))
			return directory;

		return `playerData/${player.UserId}/${directory}`;
	}
}