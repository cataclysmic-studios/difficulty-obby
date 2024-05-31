import { Workspace as World } from "@rbxts/services";

export const STAGES_PER_ZONE = 20;
export const ZONE_NAMES = <const>[
  "Newside",
  "Whisperwood",
  "Astrelyn",
  "Cascadia",
  "Mirkholm",
  "Shadowvale",
  "Solastir",
  "Artaeum",
  "Apocrypha",
  "Deadlands",
  // "The Sanguine Sea"
];

export type ZoneName = (typeof ZONE_NAMES)[number];

export function getZoneIndex(stage: number): number {
  return math.floor(stage <= STAGES_PER_ZONE ? 0 : (stage - 1) / STAGES_PER_ZONE);
}

export function getZoneName(stage: number): string {
  return ZONE_NAMES[getZoneIndex(stage)];
}

export function getZoneModel(stage: number): ZoneModel {
  return <ZoneModel>World.WaitForChild("Zones").WaitForChild(getZoneName(stage));
}
