import { Networking } from "@flamework/networking";
import type { GitHubInfo } from "./structs/github";
import type { GamepassInfo } from "shared/structs/roblox-api";

type SoundEffectName = ExcludeKeys<Omit<SoundService["SoundEffects"], "Parent" | "Changed">, SoundGroup | boolean | string | number | Callback | symbol | RBXScriptSignal>;

interface ServerEvents {
  updateBackpackItems(): void;
  stageOffsetUpdated(stage: number): void;
  data: {
    set(directory: string, value: unknown): void;
    increment(directory: string, amount?: number): void;
    decrement(directory: string, amount?: number): void;
    addToArray(directory: string, value: defined): void;
  };
  character: {
    toggleDefaultMovement(on: boolean): void;
  };
}

interface ClientEvents {
  playSoundEffect(soundName: SoundEffectName): void;
  incrementStageOffset(amount?: number): void;
  character: {
    respawn(): void;
  };
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
    get(directory: string, defaultValue?: unknown): unknown;
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
