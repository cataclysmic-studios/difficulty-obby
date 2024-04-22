interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    UI: Folder & {
      Notification: TextLabel & {
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
      Purchasable: Frame & {
        UIPadding: UIPadding;
        UIGradient: UIGradient;
        Title: TextLabel & {
          UIStroke: UIStroke;
        };
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
  };
}