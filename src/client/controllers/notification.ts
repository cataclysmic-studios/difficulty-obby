import { Controller, type OnInit } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";
import { endsWith } from "@rbxts/string-utils";

import { Events } from "client/network";
import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { tween } from "shared/utility/ui";
import { getZoneName, STAGES_PER_ZONE } from "shared/constants";

@Controller()
export class NotificationController implements OnInit {
  private readonly screen = <ScreenGui>PlayerGui.WaitForChild("Notifications");
  private readonly tweenInfo = new TweenInfoBuilder()
    .SetTime(0.15)
    .SetEasingStyle(Enum.EasingStyle.Quad);

  private lastZoneName?: string;

  public onInit(): void {
    Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "stage")) return;

      const stage = <number>value;
      const zoneName = getZoneName(stage);
      if (zoneName === this.lastZoneName) return;
      this.lastZoneName = zoneName;

      if (stage % (STAGES_PER_ZONE + 1) !== 0) return;
      this.send(`New zone discovered: ${zoneName}`);
    });
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