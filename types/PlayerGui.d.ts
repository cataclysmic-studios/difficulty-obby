interface PlayerGui extends BasePlayerGui {
  Main: ScreenGui & {
    StageInfo: Frame & {
      StageNumber: TextLabel;
      ZoneName: TextLabel;
      NextStage: TextButton;
      PreviousStage: TextButton;
      Next10Stages: TextButton;
      Previous10Stages: TextButton;
      Skip: ImageButton & {
        SkipCredits: TextLabel;
      };
    };
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
    Boosters: Frame & {
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
    Store: Frame & {
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
  LoadScreen: ScreenGui & {
    Background: ImageLabel & {
      UIGradient: UIGradient;
      UIPadding: UIPadding;
      Spinner: ImageLabel & {
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        MiniSpinner: ImageLabel;
      };
      Logo: ImageLabel & {
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
    };
  };
}