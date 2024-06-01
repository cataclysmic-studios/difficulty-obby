import { Controller, type OnInit } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";

import type { LogStart } from "shared/hooks";
import { PlayerGui } from "shared/utility/client";
import { tween } from "shared/utility/ui";

@Controller()
export class UIEffectsController implements OnInit, LogStart {
  private readonly screen = new Instance("ScreenGui", PlayerGui);
  private readonly blackFrame = new Instance("Frame", this.screen);
  private readonly whiteFrame = new Instance("Frame", this.screen);

  public onInit(): void {
    this.screen.Name = "UIEffects";
    this.screen.DisplayOrder = 10;
    this.screen.ScreenInsets = Enum.ScreenInsets.DeviceSafeInsets;

    this.blackFrame.Name = "Black";
    this.blackFrame.Size = UDim2.fromScale(1, 1);
    this.blackFrame.BackgroundColor3 = new Color3;
    this.blackFrame.Transparency = 1;

    this.whiteFrame.Name = "White";
    this.whiteFrame.Size = UDim2.fromScale(1, 1);
    this.whiteFrame.BackgroundColor3 = new Color3(1, 1, 1);
    this.whiteFrame.Transparency = 1;
  }

  public async blackFade<Disable extends boolean = false>(manualDisable = <Disable>false, timeBetween = 0.5, fadeTime = 0.65): Promise<Disable extends true ? () => Tween : void> {
    type RType = Disable extends true ? () => Tween : void;
    const info = new TweenInfoBuilder()
      .SetTime(fadeTime)
      .SetEasingStyle(Enum.EasingStyle.Sine);

    const toggle = (on: boolean) => tween(this.blackFrame, info, { Transparency: on ? 0 : 1 });
    const fadeIn = toggle(true);
    fadeIn.Completed.Wait();
    task.wait(timeBetween);

    if (!manualDisable)
      toggle(false);

    return new Promise(resolve =>
      resolve(<RType>(manualDisable === true ? () => toggle(false) : void 0))
    );
  }

  public async flash(fadeTime = 0.1, length = 0): Promise<void> {
    const info = new TweenInfoBuilder()
      .SetTime(fadeTime)
      .SetEasingStyle(Enum.EasingStyle.Sine);

    const toggle = (on: boolean) => tween(this.whiteFrame, info, { Transparency: on ? 0 : 1 });
    return new Promise((resolve, reject) => {
      const fadeIn = toggle(true);
      fadeIn.Completed.Wait();
      task.wait(length);
      toggle(false).Completed.Wait();
      resolve();
    });
  }
}