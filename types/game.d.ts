interface PortalModel extends Model {
  VFX: Folder;
  Collider: Part;
  ZoneName: Part & {
    GUI: BillboardGui & {
      Title: TextLabel;
    };
  };
}

interface ZoneModel extends Model {
  Coins: Folder;
  Checkpoints: Folder;
  Stages: Folder;
  ExitPortal: PortalModel;
}

interface NPCModel extends Model {
  Head: MeshPart;
  RootPart: Part & {
    spine: Bone & {
      ["spine.001"]: Bone & {
        ["spine.002"]: Bone & {
          ["spine.003"]: Bone & {
            ["spine.005"]: Bone & {
              ["spine.006"]: Bone; // neck bone
            };
          };
        };
      };
    };
  };
  VoiceLines: Folder;
  AnimationController: AnimationController & {
    Animator: Animator;
  };
  Animations: Folder & {
    Gratitude: Folder;
    Idle: Animation;
  };
}