interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    UI: Folder & {
      Nametag: BillboardGui & {
        Prefix: TextLabel;
      };
      TimerUI: BillboardGui & {
        Countdown: TextLabel;
      };
      LeaderboardUI: SurfaceGui & {
        Line: Frame;
        Key: Frame & {
          UIPadding: UIPadding;
        };
        List: ScrollingFrame & {
          UIPadding: UIPadding;
        };
      };
      LeaderboardEntry: Frame & {
        Username: TextLabel & {
          UIStroke: UIStroke;
        };
        UIListLayout: UIListLayout;
        Stage: TextLabel & {
          UIStroke: UIStroke;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Coins: TextLabel & {
          UIStroke: UIStroke;
        };
      };
      Notification: TextButton & {
        UIStroke: UIStroke;
      };
      Setting: Frame & {
        Title: TextLabel;
      };
      ToggleSwitch: ImageButton & {
        UIPadding: UIPadding;
        UICorner: UICorner;
        UIStroke: UIStroke;
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Node: Frame & {
          UICorner: UICorner;
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
      Price: TextLabel;
      Purchasable: Frame & {
        UIPadding: UIPadding;
        UIGradient: UIGradient;
        Title: TextLabel & {
          UIStroke: UIStroke;
        };
        Icon: ImageLabel;
        UICorner: UICorner;
        UIStroke: UIStroke;
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Buy: TextButton & {
          UIGradient: UIGradient;
          UICorner: UICorner;
          UIStroke: UIStroke;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          UIPadding: UIPadding;
        };
      };
    };
    StoreItems: Folder;
    VFX: Folder & {
      Wind: ParticleEmitter;
    };
  };
}