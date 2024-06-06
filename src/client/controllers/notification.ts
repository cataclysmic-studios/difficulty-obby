import { Controller, type OnInit } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";
import { Workspace as World, SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { PlayerGui } from "shared/utility/client";
import { Events } from "client/network";
import { Assets } from "shared/utility/instances";
import { tween } from "shared/utility/ui";
import { removeWhitespace } from "shared/utility/strings";

import type { CharacterController } from "./character";

@Controller()
export class NotificationController implements OnInit {
  private readonly screen = <ScreenGui>PlayerGui.WaitForChild("Notifications");
  private readonly tweenInfo = new TweenInfoBuilder()
    .SetTime(0.15)
    .SetEasingStyle(Enum.EasingStyle.Quad);

  public constructor(
    private readonly character: CharacterController
  ) { }

  public onInit(): void {
    Events.sendNotification.connect((message, lifetime) => this.send(message, undefined, undefined, lifetime));
    Events.sendRaceNotification.connect((message, lifetime) => this.send(message, () => this.character.teleport(World.ObbyRace.CFrame), true, lifetime));
  }

  public send(message: string, clickCallback?: Callback, fadeOutOnClick = true, lifetime = 4): void {
    if (removeWhitespace(message) === "") return;

    const janitor = new Janitor;
    const notificationLabel = janitor.Add(Assets.UI.Notification.Clone());
    notificationLabel.Position = UDim2.fromScale(0.5, -0.075);
    notificationLabel.Text = message;
    notificationLabel.Parent = this.screen;

    let fadingOut = false;
    const fadeOut = () => {
      if (fadingOut) return;
      fadingOut = true;
      janitor.Add(tween(notificationLabel, this.tweenInfo, {
        TextTransparency: 1
      }));
      janitor.Add(tween(notificationLabel.UIStroke, this.tweenInfo, {
        Transparency: 1
      })).Completed.Once(() => janitor.Destroy());
    }

    if (clickCallback !== undefined)
      janitor.Add(notificationLabel.MouseButton1Click.Connect(() => {
        task.spawn(clickCallback);
        if (fadeOutOnClick)
          fadeOut();
      }));

    Sound.SoundEffects.Notification.Play();
    janitor.Add(tween(notificationLabel, this.tweenInfo, {
      Position: UDim2.fromScale(0.5, 0)
    }).Completed.Once(() => task.delay(lifetime, fadeOut)));
  }
}