import { Controller, type OnInit } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";
import { endsWith } from "@rbxts/string-utils";

import { Events } from "client/network";
import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { tween } from "shared/utility/ui";
import { getZoneName, STAGES_PER_ZONE } from "shared/constants";

import type { ZonesController } from "./zones";

@Controller()
export class NotificationController implements OnInit {
  private readonly screen = <ScreenGui>PlayerGui.WaitForChild("Notifications");
  private readonly tweenInfo = new TweenInfoBuilder()
    .SetTime(0.15)
    .SetEasingStyle(Enum.EasingStyle.Quad);

  public constructor(
    private readonly zones: ZonesController
  ) { }

  public onInit(): void {
    this.zones.discovered.Connect(name => this.send(`New zone discovered: ${name}`));
  }

  public send(message: string): void {
    const notificationLabel = Assets.UI.Notification.Clone();
    notificationLabel.Position = UDim2.fromScale(0.5, -0.075);
    notificationLabel.Text = message;
    notificationLabel.Parent = this.screen;

    tween(notificationLabel, this.tweenInfo, {
      Position: UDim2.fromScale(0.5, 0)
    }).Completed.Once(() => task.delay(3, () => {
      tween(notificationLabel, this.tweenInfo, {
        TextTransparency: 1
      });
      tween(notificationLabel.UIStroke, this.tweenInfo, {
        Transparency: 1
      }).Completed.Once(() => notificationLabel.Destroy());
    }));
  }
}