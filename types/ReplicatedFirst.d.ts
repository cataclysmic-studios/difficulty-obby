interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    UI: Folder & {
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
    };
  };
}