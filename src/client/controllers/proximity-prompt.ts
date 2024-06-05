import { Controller, type OnInit } from "@flamework/core";
import { UserInputService as UserInput } from "@rbxts/services";
import { TweenInfoBuilder } from "@rbxts/builders";
import { Union } from "@rbxts/gamejoy/out/Actions";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import { PlayerGui } from "shared/utility/client";
import { InputInfluenced } from "client/classes/input-influenced";
import { tween } from "shared/utility/ui";

@Controller()
export class ProximityPromptController extends InputInfluenced implements OnInit, LogStart {
  public readonly activated = new Signal<(actionID?: string) => void>;

  private readonly keybind = new Union(["E", "ButtonX"]);
  private readonly label = PlayerGui.Main.Main.ProximityPrompt;
  private readonly defaultStrokeTrans = this.label.UIStroke.Transparency;
  private readonly tweenInfo = new TweenInfoBuilder().SetTime(0.2);
  private currentID?: string;
  private lastActionText?: string;
  private on = this.label.Visible;

  public onInit(): void {
    UserInput.GamepadConnected.Connect(() => {
      if (this.lastActionText === undefined || this.currentID === undefined) return;
      this.setAction(this.lastActionText, this.currentID);
    });
    UserInput.GamepadDisconnected.Connect(() => {
      if (this.lastActionText === undefined || this.currentID === undefined) return;
      this.setAction(this.lastActionText, this.currentID);
    });

    this.input.Bind(this.keybind, () => this.activate());
    if (this.hasTouchscreen())
      this.label.MouseButton1Click.Connect(() => this.activate());
  }

  private hasTouchscreen(): boolean {
    return UserInput.TouchEnabled;
  }

  private hasGamepad(): boolean {
    return UserInput.GamepadEnabled;
  }

  private activate(): void {
    if (!this.on) return;
    this.activated.Fire(this.currentID);
  }

  public setAction(actionText: string, actionID: string): void {
    const [keyboardKey, gamepadButton] = this.keybind.Content;
    this.currentID = actionID;
    this.lastActionText = actionText;

    const [bindName] = (this.hasGamepad() ? gamepadButton : keyboardKey).Name.gsub("Button", "");
    this.label.Text = this.hasTouchscreen() ? `Tap here to ${actionText}` : `[${bindName}] ${actionText}`;
  }

  public toggle(on: boolean): void {
    this.on = on;
    if (on) {
      this.label.TextTransparency = 1;
      this.label.UIStroke.Transparency = 1;
      this.label.Visible = true;
    }

    tween(this.label, this.tweenInfo, {
      TextTransparency: on ? 0 : 1
    });
    const t = tween(this.label.UIStroke, this.tweenInfo, {
      Transparency: on ? this.defaultStrokeTrans : 1
    });

    if (!on)
      t.Completed.Once(() => this.label.Visible = false);
  }
}