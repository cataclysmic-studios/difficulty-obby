interface PlayerGui extends BasePlayerGui {
  Main: ScreenGui & {
    Settings: Frame & {
      Title: TextLabel & {
        UIStroke: UIStroke;
      };
      UIGradient: UIGradient;
      Close: ImageButton & {
        UIGradient: UIGradient;
        UICorner: UICorner;
        UIStroke: UIStroke;
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Icon: ImageLabel;
      };
      List: ScrollingFrame;
      UICorner: UICorner;
      UIStroke: UIStroke & {
        UIGradient: UIGradient;
      };
      UIAspectRatioConstraint: UIAspectRatioConstraint;
      UIPadding: UIPadding;
    };
    Shop: Frame & {
      Title: TextLabel & {
        UIStroke: UIStroke;
      };
      UIGradient: UIGradient;
      Close: ImageButton & {
        UIGradient: UIGradient;
        UICorner: UICorner;
        UIStroke: UIStroke;
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Icon: ImageLabel;
      };
      List: ScrollingFrame;
      UICorner: UICorner;
      UIStroke: UIStroke & {
        UIGradient: UIGradient;
      };
      UIAspectRatioConstraint: UIAspectRatioConstraint;
      UIPadding: UIPadding;
    };
    Main: Frame & {
      ProximityPrompt: TextLabel & {
        UIStroke: UIStroke;
      };
      Buttons: Frame & {
        UIListLayout: UIListLayout;
        Shop: ImageButton & {
          UIGradient: UIGradient;
          UICorner: UICorner;
          UIStroke: UIStroke & {
            UIGradient: UIGradient;
          };
          Icon: ImageLabel;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Settings: ImageButton & {
          UIGradient: UIGradient;
          UICorner: UICorner;
          UIStroke: UIStroke & {
            UIGradient: UIGradient;
          };
          Icon: ImageLabel;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
    };
    UIPadding: UIPadding;
  };
}