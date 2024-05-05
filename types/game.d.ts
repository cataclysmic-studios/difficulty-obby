interface PortalModel extends Model {
  readonly VFX: Folder;
  readonly Collider: Part;
  readonly ZoneName: Part & {
    readonly GUI: BillboardGui & {
      readonly Title: TextLabel;
    };
  };
}

interface ZoneModel extends Model {
  readonly Coins: Folder;
  readonly Checkpoints: Folder;
  readonly Stages: Folder;
  readonly ExitPortal: PortalModel;
}

interface NPCModel extends Model {
  readonly Head: MeshPart;
  readonly RootPart: Part & {
    readonly spine: Bone & {
      readonly ["spine.001"]: Bone & {
        readonly ["spine.002"]: Bone & {
          readonly ["spine.003"]: Bone & {
            readonly ["spine.005"]: Bone & {
              readonly ["spine.006"]: Bone; // neck bone
            };
          };
        };
      };
    };
  };
  readonly VoiceLines: Folder;
  readonly AnimationController: AnimationController & {
    readonly Animator: Animator;
  };
  readonly Animations: Folder & {
    readonly Gratitude: Folder;
    readonly Idle: Animation;
  };
}

interface CharacterModel extends Model {
  Humanoid: Humanoid;
  Head: Part;
}

interface ToggleSwitchButton extends ImageButton {
  UIPadding: UIPadding;
  UICorner: UICorner;
  UIStroke: UIStroke;
  UIAspectRatioConstraint: UIAspectRatioConstraint;
  Node: Frame & {
    UICorner: UICorner;
    UIStroke: UIStroke;
    UIAspectRatioConstraint: UIAspectRatioConstraint;
  };
}