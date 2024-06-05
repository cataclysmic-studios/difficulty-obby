interface PlayerGui extends BasePlayerGui {
  OpeningCrate: ScreenGui & {
    Title: TextLabel;
    RewardCard: Frame & {
      UIGradient: UIGradient;
      Claim: TextButton;
      Icon: ImageLabel & {
        UIGradient: UIGradient;
      };
      ItemType: TextLabel;
      Title: TextLabel
    };
  };
  Main: ScreenGui & {
    BoosterNote: TextLabel;
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
    DailyRewards: Frame & {
      List: Frame & {
        UIGridLayout: UIGridLayout;
        UIPadding: UIPadding;
        Day1: TextButton & {
          Claimed: ImageLabel;
          GrayedOut: Frame;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Note: TextLabel & {
            UIStroke: UIStroke;
          };
          UIGradient: UIGradient;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          UICorner: UICorner;
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          UIPadding: UIPadding;
        };
        Day2: TextButton & {
          Claimed: ImageLabel;
          GrayedOut: Frame;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Note: TextLabel & {
            UIStroke: UIStroke;
          };
          UIGradient: UIGradient;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          UICorner: UICorner;
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          UIPadding: UIPadding;
        };
        Day3: TextButton & {
          Claimed: ImageLabel;
          GrayedOut: Frame;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Note: TextLabel & {
            UIStroke: UIStroke;
          };
          UIGradient: UIGradient;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          UICorner: UICorner;
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          UIPadding: UIPadding;
        };
        Day4: TextButton & {
          Claimed: ImageLabel;
          GrayedOut: Frame;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Note: TextLabel & {
            UIStroke: UIStroke;
          };
          UIGradient: UIGradient;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          UICorner: UICorner;
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          UIPadding: UIPadding;
        };
        Day5: TextButton & {
          Claimed: ImageLabel;
          GrayedOut: Frame;
          Note: TextLabel & {
            UIStroke: UIStroke;
          };
          UIGradient: UIGradient;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          UICorner: UICorner;
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          UIPadding: UIPadding;
        };
        Day6: TextButton & {
          Claimed: ImageLabel;
          GrayedOut: Frame;
          Note: TextLabel & {
            UIStroke: UIStroke;
          };
          UIGradient: UIGradient;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          UICorner: UICorner;
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          UIPadding: UIPadding;
        };
        NoGrid: Folder & {
          Day7: TextButton & {
            Claimed: ImageLabel;
            GrayedOut: Frame;
            Note: TextLabel & {
              UIStroke: UIStroke;
            };
            UIPadding: UIPadding;
            Title: TextLabel & {
              UIStroke: UIStroke;
            };
            UICorner: UICorner;
            UIStroke: UIStroke;
            UIGradient: UIGradient;
          };
        };
      };
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
      UICorner: UICorner;
      UIStroke: UIStroke & {
        UIGradient: UIGradient;
      };
      UIAspectRatioConstraint: UIAspectRatioConstraint;
      UIPadding: UIPadding;
    };
    Crates: Frame & {
      List: Frame & {
        UIPadding: UIPadding;
        Pro: Frame & {
          UIPadding: UIPadding;
          UICorner: UICorner;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          Price: TextLabel & {
            UIStroke: UIStroke;
          };
          Open: TextButton & {
            UIGradient: UIGradient;
            UICorner: UICorner;
            UIStroke: UIStroke;
            Title: TextLabel & {
              UIStroke: UIStroke;
            };
            UIPadding: UIPadding;
          };
          UIStroke: UIStroke;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          UIGradient: UIGradient;
        };
        UIListLayout: UIListLayout;
        Beast: Frame & {
          UIPadding: UIPadding;
          UICorner: UICorner;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          Price: TextLabel & {
            UIStroke: UIStroke;
          };
          Open: TextButton & {
            UIGradient: UIGradient;
            UICorner: UICorner;
            UIStroke: UIStroke;
            Title: TextLabel & {
              UIStroke: UIStroke;
            };
            UIPadding: UIPadding;
          };
          UIStroke: UIStroke;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          UIGradient: UIGradient;
        };
        Noob: Frame & {
          UIPadding: UIPadding;
          UICorner: UICorner;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          Title: TextLabel & {
            UIStroke: UIStroke;
          };
          Price: TextLabel & {
            UIStroke: UIStroke;
          };
          Open: TextButton & {
            UIGradient: UIGradient;
            UICorner: UICorner;
            UIStroke: UIStroke;
            Title: TextLabel & {
              UIStroke: UIStroke;
            };
            UIPadding: UIPadding;
          };
          UIStroke: UIStroke;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          UIGradient: UIGradient;
        };
      };
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
      UICorner: UICorner;
      UIStroke: UIStroke & {
        UIGradient: UIGradient;
      };
      UIAspectRatioConstraint: UIAspectRatioConstraint;
      UIPadding: UIPadding;
    };
    Trails: Frame & {
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
      ProximityPrompt: TextButton & {
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