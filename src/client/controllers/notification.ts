import { Controller, type OnInit } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";
import { SoundService as Sound } from "@rbxts/services";

import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { tween } from "shared/utility/ui";

import type { ZonesController } from "./zones";
import { Janitor } from "@rbxts/janitor";

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

  public send(message: string, clickCallback?: Callback): void {
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