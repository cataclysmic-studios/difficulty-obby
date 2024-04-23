import { Controller, type OnInit } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";
import type { RawActionEntry } from "@rbxts/gamejoy";
import Signal from "@rbxts/signal";

import type { LogStart } from "shared/hooks";
import { InputInfluenced } from "client/classes/input-influenced";
import { PlayerGui } from "shared/utility/client";
import { tween } from "shared/utility/ui";

@Controller()
export class ProximityPromptController extends InputInfluenced implements OnInit, LogStart {
  public readonly activated = new Signal<(actionID?: string) => void>;

  private readonly keybind: RawActionEntry = "E";
  private readonly label = PlayerGui.Main.Main.ProximityPrompt;
  private readonly defaultStrokeTrans = this.label.UIStroke.Transparency;
  private readonly tweenInfo = new TweenInfoBuilder().SetTime(0.2);
  private currentID?: string;
  private on = this.label.Visible;

  public onInit(): void {
    this.input.Bind(this.keybind, () => {
      if (!this.on) return;
      this.activated.Fire(this.currentID);
    });
  }

  public setAction(actionText: string, actionID: string): void {
    this.currentID = actionID;
    this.label.Text = `[${this.keybind}] ${actionText}`;
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