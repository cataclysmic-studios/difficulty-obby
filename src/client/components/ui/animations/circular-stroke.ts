import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";

import { tween } from "shared/utility/ui";
import ButtonTweenAnimation from "client/base-components/button-tween-animation";
import { Janitor } from "@rbxts/janitor";

interface Attributes {
  PrimaryColor: Color3;
  SecondaryColor: Color3;
  Thickness: number;
  Speed: number;
}

const { EasingStyle } = Enum;

@Component({
  tag: "CircularStrokeAnimation",
  defaults: {
    PrimaryColor: new Color3(1, 1, 1),
    SecondaryColor: new Color3(0.8, 0.8, 0.8),
    Thickness: 2.4,
    Speed: 1.25
  }
})
export class CircularStrokeAnimation extends ButtonTweenAnimation<Attributes, GuiButton> implements OnStart {
  protected override readonly includeClick = false;

  private readonly defaultStrokes = this.instance.GetChildren().filter((i): i is UIStroke => i.IsA("UIStroke"));
  private readonly defaultStrokeParents = this.defaultStrokes.map(stroke => stroke.Parent!);
  private readonly circularStroke = new Instance("UIStroke");
  private readonly gradient = new Instance("UIGradient", this.circularStroke);
  private readonly changedJanitor = new Janitor;

  protected readonly tweenInfo = new TweenInfoBuilder()
    .SetEasingStyle(EasingStyle.Linear)
    .SetTime(this.attributes.Speed)
    .SetRepeatCount(math.huge);

  public onStart(): void {
    super.onStart();

    this.circularStroke.Name = "CircularStroke";
    this.circularStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border;
    this.circularStroke.Transparency = 0;
    this.circularStroke.Color = new Color3(1, 1, 1);
    this.gradient.Transparency = new NumberSequence(0);
    this.gradient.Color = new ColorSequence([
      new ColorSequenceKeypoint(0, this.attributes.PrimaryColor),
      new ColorSequenceKeypoint(0.5, this.attributes.SecondaryColor),
      new ColorSequenceKeypoint(1, this.attributes.PrimaryColor)
    ]);
  }

  public active(): void {
    this.changedJanitor.Cleanup();
    for (const stroke of this.defaultStrokes)
      stroke.Parent = undefined;

    this.gradient.Rotation = -180;
    this.circularStroke.Parent = this.instance;
    this.circularStroke.Thickness = this.attributes.Thickness;
    this.changedJanitor.Add(tween(this.gradient, this.tweenInfo, { Rotation: 180 }), "Cancel");
  }

  public inactive(): void {
    this.changedJanitor.Cleanup();
    this.circularStroke.Parent = undefined;
    this.defaultStrokes.forEach((stroke, i) => stroke.Parent = this.defaultStrokeParents[i]);
    this.gradient.Rotation = -180;
  }
}