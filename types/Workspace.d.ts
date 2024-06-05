interface Workspace extends WorldModel {
  Crates: Model & {
    CratePosition: Part;
    CameraPart: Part;
  };
  Zones: Model;
  StartPoints: Model;
  ZoneHubs: Folder;
}