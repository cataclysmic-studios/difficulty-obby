import { type OnInit, Service } from "@flamework/core";
import { endsWith, startsWith } from "@rbxts/string-utils";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import { Events, Functions } from "server/network";
import Firebase from "server/firebase";
import Log from "shared/logger";

const db = new Firebase;

@Service({ loadOrder: 0 })
export class DatabaseService implements OnInit, LogStart {
	public readonly loaded = new Signal<(player: Player) => void>;
	public readonly updated = new Signal<<T = unknown>(player: Player, directory: string, value: T) => void>;

	public onInit(): void {
		Events.data.set.connect((player, directory, value) => this.set(player, directory, value));
		Events.data.increment.connect((player, directory, amount) => this.increment(player, directory, amount))
		Events.data.decrement.connect((player, directory, amount) => this.decrement(player, directory, amount))
		Events.data.addToArray.connect((player, directory, value) => this.addToArray(player, directory, value))
		Functions.data.initialize.setCallback((player) => this.setup(player));
		Functions.data.get.setCallback((player, directory, defaultValue) => this.get(player, directory, defaultValue));
	}

	public get<T>(player: Player, directory: string, defaultValue?: T): T {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		return db.get(fullDirectory) ?? <T>defaultValue;
	}

	public set<T>(player: Player, directory: string, value: T, noRequest = false): void {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		db.set(fullDirectory, value);
		this.update(player, fullDirectory, value);
	}

	public increment(player: Player, directory: string, amount = 1): number {
		const fullDirectory = this.getDirectoryForPlayer(player, directory);
		const value = db.increment(fullDirectory, amount);

		if (endsWith(directory, "coins"))
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

	private update(player: Player, fullDirectory: string, value: unknown): void {
		this.updated.Fire(player, fullDirectory, value);
		Events.data.updated(player, fullDirectory, value);
	}

	private setup(player: Player): void {
		this.initialize(player, "stage", 0);
		this.initialize(player, "coins", 0);
		this.initialize(player, "ownedItems", []);
		this.initialize(player, "lastCoinRefresh", 0);
		this.initializeSettings(player);

		this.loaded.Fire(player);
		Log.info("Initialized data");
	}

	private initializeSettings(player: Player) {
		this.initialize(player, "settings/soundEffects", true);
		this.initialize(player, "settings/music", true);
		this.initialize(player, "settings/hidePlayers", false);
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