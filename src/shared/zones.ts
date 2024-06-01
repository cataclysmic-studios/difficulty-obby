import { Workspace as World } from "@rbxts/services";

export interface Zone {
  readonly name: string;
  readonly stageCount: number;
}

export type ZoneName = (typeof ZONES)[number]["name"];

export const ZONES = <const>[
  {
    name: "Newside",
    stageCount: 20
  }, {
    name: "Whisperwood",
    stageCount: 20
  }, {
    name: "Astrelyn",
    stageCount: 20
  }, {
    name: "Cascadia",
    stageCount: 20
  }, {
    name: "Mirkholm",
    stageCount: 20
  }, {
    name: "Shadowvale",
    stageCount: 20
  }, {
    name: "Solastir",
    stageCount: 20
  }, {
    name: "Artaeum",
    stageCount: 20
  }, {
    name: "Apocrypha",
    stageCount: 20
  }, {
    name: "Deadlands",
    stageCount: 40
  },
  // {
  //   name: "The Sanguine Sea",
  //   stageCount: 40
  // }
];

// ZONES but with the last zone remove
const zonesClone = table.clone(ZONES);
zonesClone.pop();

export const TOTAL_STAGE_COUNT = zonesClone.reduce((sum, zone) => sum + zone.stageCount, 0);

export function getZoneIndex(stage: number): number {
  let n = stage; // sorry idk what else to fucin name this
  let currentZone: Zone;
  for (const zone of ZONES) {
    currentZone = zone;
    n -= zone.stageCount;
    if (n <= 0) break;
  }

  return (<readonly Zone[]>ZONES).indexOf(currentZone!);
}

export function getZone(stage: number): Zone {
  return ZONES[getZoneIndex(stage)];
}

export function getZoneModel(stage: number): ZoneModel {
  return <ZoneModel>World.WaitForChild("Zones").WaitForChild(getZone(stage).name);
}