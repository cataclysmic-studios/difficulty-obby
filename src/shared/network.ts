import { Networking } from "@flamework/networking";
import type { GitHubInfo } from "./structs/github";
import type { GamepassInfo } from "shared/structs/roblox-api";

type SoundEffectName = ExcludeKeys<Omit<SoundService["SoundEffects"], "Parent" | "Changed">, SoundGroup | boolean | string | number | Callback | symbol | RBXScriptSignal>;

interface ServerEvents {
  data: {
    set(directory: string, value: unknown): void;
    increment(directory: string, amount?: number): void;
  };
  character: {
    toggleDefaultMovement(on: boolean): void;
  };
}

interface ClientEvents {
  playSoundEffect(soundName: SoundEffectName): void;
  uiEffects: {
    fadeBlack(timeBetween?: number, fadeTime?: number): void;
  };
  data: {
    updated(directory: string, value: unknown): void;
  };
}

interface ServerFunctions {
  data: {
    initialize(): void;
    get(directory: string): unknown;
  };
  github: {
    getInfo(): GitHubInfo;
  };
  roblox: {
    getGamepasses(amount?: number): GamepassInfo[];
  };
}

interface ClientFunctions { }

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
