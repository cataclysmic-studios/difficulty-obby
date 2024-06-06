interface Workspace extends WorldModel {
  ObbyRace: Part;
  Crates: Model & {
    CratePosition: Part;
    CameraPart: Part;
  };
  Zones: Model;
  StartPoints: Model;
  ZoneHubs: Folder;
}