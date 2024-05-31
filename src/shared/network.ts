import { Networking } from "@flamework/networking";

interface ServerEvents {
  stageOffsetUpdated(stage: number, advancing?: boolean): void;
  sendGlobalNotification(message: string): void;
  nuke(): void;
  data: {
    set(directory: string, value: unknown): void;
    increment(directory: string, amount?: number): void;
    giveCoins(username: string): void;
    decrement(directory: string, amount?: number): void;
    addToArray(directory: string, value: defined): void;
    initialize(): void;
    useSkipCredit(): void;
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
    get(directory?: string, defaultValue?: unknown): unknown;
    ownsInvincibility(): boolean;
  };
}

interface ClientFunctions { }

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();