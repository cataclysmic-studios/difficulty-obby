interface Workspace extends WorldModel {
  ObbyRace: Part;
  Lobby: Model & {
    Dark: Model & {
      SpawnLocation: SpawnLocation;
    };
  };
  Crates: Model & {
    CratePosition: Part;
    CameraPart: Part;
  };
  Zones: Model;
  StartPoints: Model;
  ZoneHubs: Folder;
}