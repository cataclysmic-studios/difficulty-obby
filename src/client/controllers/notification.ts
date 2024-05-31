import { Controller, type OnInit } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";
import { SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { PlayerGui } from "shared/utility/client";
import { Events } from "client/network";
import { Assets } from "shared/utility/instances";
import { tween } from "shared/utility/ui";
import { removeWhitespace } from "shared/utility/strings";

@Controller()
export class NotificationController implements OnInit {
  private readonly screen = <ScreenGui>PlayerGui.WaitForChild("Notifications");
  private readonly tweenInfo = new TweenInfoBuilder()
    .SetTime(0.15)
    .SetEasingStyle(Enum.EasingStyle.Quad);

  public onInit(): void {
    Events.sendNotification.connect(message => this.send(message));
  }

  public send(message: string, clickCallback?: Callback): void {
    if (removeWhitespace(message) === "") return;

    const janitor = new Janitor;
    const notificationLabel = janitor.Add(Assets.UI.Notification.Clone());
    notificationLabel.Position = UDim2.fromScale(0.5, -0.075);
    notificationLabel.Text = message;
    notificationLabel.Parent = this.screen;

    if (clickCallback !== undefined)
      janitor.Add(notificationLabel.MouseButton1Click.Connect(clickCallback));

    Sound.SoundEffects.Notification.Play();
    janitor.Add(tween(notificationLabel, this.tweenInfo, {
      Position: UDim2.fromScale(0.5, 0)
    }).Completed.Once(() => task.delay(4, () => {
      janitor.Add(tween(notificationLabel, this.tweenInfo, {
        TextTransparency: 1
      }));
      janitor.Add(tween(notificationLabel.UIStroke, this.tweenInfo, {
        Transparency: 1
      })).Completed.Once(() => janitor.Destroy());
    })));
  }
}