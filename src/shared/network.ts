import { Networking } from "@flamework/networking";
import type { GitHubInfo } from "./structs/github";
import type { GamepassInfo } from "./structs/roblox-api";

type SoundEffectName = ExcludeKeys<Omit<SoundService["SoundEffects"], "Parent" | "Changed">, SoundGroup | boolean | string | number | Callback | symbol | RBXScriptSignal>;

interface ServerEvents {
  updateBackpackItems(): void;
  stageOffsetUpdated(stage: number, advancing?: boolean): void;
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
  advanceStageOffset(): void;
  sendNotification(message: string): void;
  nukeShake(): void;
  character: {
    respawn(promptSkip?: boolean): void;
    toggleCustomMovement(on: boolean): void;
  };
  uiEffects: {
    blackFade(timeBetween?: number, fadeTime?: number): void;
  };
  data: {
    updated(directory: string, value: unknown): void;
  };
  transactions: {
    processed(productType: "GamePass" | "DevProduct", id: number): void;
  };
}

interface ServerFunctions {
  data: {
    initialize(): void;
    get(directory: string, defaultValue?: unknown): unknown;
    ownsInvincibility(): boolean;
  };
  github: {
    getInfo(): GitHubInfo;
  };
  roblox: {
    getGamepasses(amount?: number): unknown[];
  };
}

interface ClientFunctions { }

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();