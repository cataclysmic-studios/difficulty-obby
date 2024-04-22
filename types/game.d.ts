interface PortalModel extends Model {
  VFX: Folder;
  Detail: Model;
  Collider: Part;
  ZoneName: Part & {
    GUI: BillboardGui & {
      Title: TextLabel;
    };
  };
}