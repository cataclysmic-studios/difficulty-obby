import { Workspace as World } from "@rbxts/services";

export const CREATOR_ID = game.CreatorType === Enum.CreatorType.User ? game.CreatorId : 44966864; // add your user ID here if you're the creator
export const DEVELOPERS = [CREATOR_ID]; // add extra developer user IDs here

export const STAGES_PER_ZONE = 20;
export const ZONE_NAMES = [ // only hard coded to keep constant index
  "Newside",
  "Whisperwood",
  "Astrelyn"
];

export function getZoneIndex(stage: number): number {
  return math.floor(stage <= STAGES_PER_ZONE ? 0 : (stage - 1) / STAGES_PER_ZONE);
}

export function getZoneName(stage: number): string {
  return ZONE_NAMES[getZoneIndex(stage)];
}

export function getZoneModel(stage: number): Model {
  return <Model>World.Zones.WaitForChild(getZoneName(stage));
}