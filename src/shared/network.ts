import { Networking } from "@flamework/networking";

interface ServerEvents {
  stageOffsetUpdated(stage: number, advancing?: boolean): void;
  sendGlobalNotification(message: string, lifetime?: number): void;
  nuke(): void;
  data: {
    updateLoginStreak(): void;
    rewardBooster(): void
    useBooster(name: string): void;
    useSkipCredit(): void;
    set(directory: string, value: unknown): void;
    increment(directory: string, amount?: number): void;
    giveCoins(username: string): void;
    setStage(username: string, stage: number): void;
    decrement(directory: string, amount?: number): void;
    addToArray(directory: string, value: defined): void;
    deleteFromArray(directory: string, value: defined): void;
    initialize(): void;
  };
  character: {
    toggleDefaultMovement(on: boolean): void;
  };
}

interface ClientEvents {
  nukeShake(): void;
  playSoundEffect(soundName: SoundEffectName): void;
  advanceStageOffset(): void;
  sendNotification(message: string, lifetime?: number): void;
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
  isBoosterActive(name: string): boolean;
  data: {
    initialize(): void;
    get(directory?: string, defaultValue?: unknown): unknown;
    ownsInvincibility(): boolean;
  };
}

interface ClientFunctions { }

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();