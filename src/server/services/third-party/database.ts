import { type OnInit, Service } from "@flamework/core";
import { endsWith, startsWith } from "@rbxts/string-utils";
import { MarketplaceService as Market, Players, ReplicatedStorage } from "@rbxts/services";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import type { OnPlayerLeave } from "server/hooks";
import { Events, Functions } from "server/network";
import { PassIDs } from "shared/structs/product-ids";
import { toSeconds } from "shared/utility/time";
import { type PlayerData, ActiveBooster, INITIAL_DATA } from "shared/data-models/player-data";
import { BOOSTERS } from "shared/constants";
import Firebase from "server/firebase";

const { max } = math;

const INF_COINS = 999_999_999;
const db = new Firebase;

export const enum MultiplierType {
	Coins
}

@Service({ loadOrder: 0 })
export class DatabaseService implements OnInit, OnPlayerLeave, LogStart {
	public readonly loaded = new Signal<(player: Player) => void>;
	public readonly updated = new Signal<(player: Player, directory: string, value: unknown) => void>;
	public playerData: Record<string, PlayerData> = {};

	public onInit(): void {
		this.playerData = this.getDatabase();
		Events.data.set.connect((player, directory, value) => this.set(player, directory, value));
		Events.data.increment.connect((player, directory, amount) => this.increment(player, directory, amount));
		Events.data.decrement.connect((player, directory, amount) => this.decrement(player, directory, amount));
		Events.data.addToArray.connect((player, directory, value) => this.addToArray(player, directory, value));
		Events.data.deleteFromArray.connect((player, directory, value) => this.deleteFromArray(player, directory, value));
		Events.data.initialize.connect(player => {
			this.setup(player);
			do {
				const timeSinceLastCredit = os.time() - this.get<number>(player, "lastSkipCredit", 0);
				const time = max(30 * 60 - timeSinceLastCredit, 0);
				task.wait(time); // every 30 mins
				if (player.IsInGroup(3510882))
					this.addSkipCredit(player);
			} while (Players.GetPlayers().map(p => p.Name).includes(player.Name));
		});
		Events.data.giveCoins.connect((_, username) => {
			const player = Players.GetPlayers().find(player => player.Name === username);
			if (player === undefined) return;
			this.increment(player, "coins", 1000);
		});
		Events.data.setStage.connect((_, username, stage) => {
			const player = Players.GetPlayers().find(player => player.Name === username);
			if (player === undefined) return;
			this.set(player, "stage", stage);
			Events.character.respawn(player, false);
		});

		Functions.data.get.setCallback((player, directory, defaultValue) => this.get(player, directory ?? "", defaultValue));
		Functions.data.ownsInvincibility.setCallback(player => this.ownsInvincibilityPass(player));

		ReplicatedStorage.SwordKill.Event.Connect((killer: Player) => this.increment(killer, "coins", 5));
	}

	public onPlayerLeave(player: Player): void {
		db.set(`playerData/${player.UserId}`, this.getCached(player));
	}

	public get<T>(player: Player, directory: string, defaultValue?: T): T {
		let data: Record<string, unknown> = this.getCached(player);
		if (directory === "") return <T>data;

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

	public increment(player: Player, directory: string, amount = 1, incrementing = true): number {
		const incrementingCoins = endsWith(directory, "coins");
		if (incrementingCoins && incrementing) {
			Events.playSoundEffect(player, "GainCoins");
			const coinMultiplier = this.getMultiplier(player, MultiplierType.Coins);
			amount *= coinMultiplier;
		}

		const oldValue = this.get<number>(player, directory, 0);
		const value = oldValue + amount;
		this.set(player, directory, value);
		return value;
	}

	public decrement(player: Player, directory: string, amount = 1): number {
		return this.increment(player, directory, -amount, false);
	}

	public addToArray<T extends defined = defined>(player: Player, directory: string, value: T): void {
		const array = this.get<T[]>(player, directory, []);
		array.push(value);
		this.set(player, directory, array);
	}

	public deleteFromArray<T extends defined = defined>(player: Player, directory: string, value: T): void {
		const array = this.get<T[]>(player, directory);
		array.remove(array.indexOf(value));
		this.set(player, directory, array);
	}

	public filterFromArray<T extends defined = defined>(player: Player, directory: string, filter: (value: T, index: number) => boolean): void {
		const array = this.get<T[]>(player, directory, []);
		this.set(player, directory, array.filter(filter));
	}

	public delete(player: Player, directory: string): void {
		this.set(player, directory, undefined);
	}

	public getDatabase(): Record<string, PlayerData> {
		return db.get("playerData", {});
	}

	public addSkipCredit(player: Player): void {
		Events.sendNotification(player, "You earned a skip credit!");
		this.increment(player, "skipCredits");
		this.set(player, "lastSkipCredit", os.time());
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
				const doubleCoinsPass = Market.UserOwnsGamePassAsync(player.UserId, PassIDs.DoubleCoins) ? 1 : 0;
				const doubleCoinsBooster = this.isBoosterActive(player, "Double Coins") ? 1 : 0;
				return 1 + doubleCoinsPass + doubleCoinsBooster;
			}
		}
	}

	public isBoosterActive(player: Player, name: string): boolean {
		const activeBoosters = this.get<ActiveBooster[]>(player, "activeBoosters", []).sort((a, b) => a.activatedTimestamp < b.activatedTimestamp);
		const activeBooster = activeBoosters.find(booster => booster.name === name);
		const booster = BOOSTERS.find(booster => booster.name === name);
		if (booster === undefined || activeBooster === undefined) return false;

		const boosterLength = toSeconds(booster.length);
		const timeSinceActivation = os.time() - activeBooster.activatedTimestamp;
		return timeSinceActivation < boosterLength;
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
		this.initialize(player, "equippedTrail", undefined);
		this.initialize(player, "ownedItems", []);
		this.initialize(player, "ownedCrates", []);
		this.initialize(player, "ownedTrails", []);
		this.initialize(player, "ownedBoosters", []);
		this.initialize(player, "activeBoosters", []);
		this.initialize(player, "lastCoinRefresh", os.time());
		this.initialize(player, "dailyCoinsClaimed", {});
		this.initialize(player, "skipCredits", 0);
		this.initialize(player, "lastLogin", 0);
		this.initialize(player, "loginStreak", 0);
		this.initialize(player, "claimedDaily", false);
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

	private initializeSettings(player: Player): void {
		this.initialize(player, "settings/soundEffects", true);
		this.initialize(player, "settings/lobbyMusic", true);
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