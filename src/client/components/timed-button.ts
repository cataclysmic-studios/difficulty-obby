import type { OnStart } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { RunService as Runtime } from "@rbxts/services";

import type { TimedPart } from "./timed-part";
import type { SoundEffectsController } from "client/controllers/sound-effects";
import { Assets } from "shared/utility/instances";
import { roundDecimal } from "shared/utility/numbers";

const { clamp } = math;

const MAX_TICK_SPEED = 5;

interface Attributes {
  readonly TimedButton_Number: number;
  readonly TimedButton_Time: number;
}

@Component({ tag: "TimedButton" })
export class TimedButton extends BaseComponent<Attributes, BasePart> implements OnStart {
  private readonly defaultColor = this.instance.Color;

  public constructor(
    private readonly components: Components,
    private readonly soundEffects: SoundEffectsController
  ) { super(); }

  public onStart(): void {
    const time = this.attributes.TimedButton_Time;
    let debounce = false;
    this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (character === undefined || humanoid === undefined) return;
      if (debounce) return;
      debounce = true;

      const ui = Assets.UI.TimerUI.Clone();
      ui.Parent = this.instance;

      this.instance.Color = Color3.fromRGB(255, 0, 0);
      this.soundEffects.playIn("TimerStep", this.instance);
      this.toggle(true);
      this.playTicking(ui);

      task.delay(time, () => {
        this.instance.Color = this.defaultColor;
        this.toggle(false);
        ui.Destroy();
        task.wait(0.5);
        debounce = false;
      });
    });
  }

  private playTicking(ui: typeof Assets.UI.TimerUI): void {
    const time = this.attributes.TimedButton_Time;
    let ticking: Maybe<Sound>;
    let timePosition = 0;

    const conn = Runtime.Heartbeat.Connect(dt => {
      if (ticking === undefined) return;
      if (timePosition >= time)
        return ticking.Stop();

      const speed = (timePosition / time) * MAX_TICK_SPEED;
      const countdown = roundDecimal(time - timePosition, 2);
      ticking.PlaybackSpeed = clamp(speed, 1, MAX_TICK_SPEED);
      ui.Countdown.Text = "%.2f".format(countdown);
      timePosition += dt;
    });
    ticking = this.soundEffects.playIn("TimerTick", this.instance, () => conn.Disconnect());
  }

  private toggle(on: boolean): void {
    for (const timedPart of this.components.getAllComponents<TimedPart>()) {
      if (timedPart.attributes.TimedPart_LinkedButton !== this.attributes.TimedButton_Number) continue;
      timedPart.toggle(on);
    }
  }
}