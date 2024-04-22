import { Controller } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";
import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { tween } from "shared/utility/ui";

@Controller()
export class NotificationController {
  private readonly screen = <ScreenGui>PlayerGui.WaitForChild("Notifications");
  private readonly tweenInfo = new TweenInfoBuilder()
    .SetTime(0.15)
    .SetEasingStyle(Enum.EasingStyle.Quad);

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