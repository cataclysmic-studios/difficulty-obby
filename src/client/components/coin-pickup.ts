import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";

import type { CharacterController } from "client/controllers/character";
import DestroyableComponent from "shared/base-components/destroyable";
import { Events } from "client/network";
import { endsWith } from "@rbxts/string-utils";
import { tween } from "shared/utility/ui";
import { TweenInfoBuilder } from "@rbxts/builders";

interface Attributes {
  readonly CoinPickup_Worth: number;
}

@Component({ tag: "CoinPickup" })
export class CoinPickup extends DestroyableComponent<Attributes, BasePart> implements OnStart {
  public constructor(
    private readonly character: CharacterController
  ) { super(); }

  public onStart(): void {
    const tweenInfo = new TweenInfoBuilder()
      .SetTime(1)
      .SetEasingStyle(Enum.EasingStyle.Linear);

    let destroyed = false;
    let loaded = false;
    let debounce = false;
    this.janitor.Add(this.instance);
    this.janitor.Add(() => destroyed = true);
    this.janitor.Add(this.instance.Touched.Once(hit => {
      const character = this.character.get();
      if (hit.FindFirstAncestorOfClass("Model") !== character) return;
      if (!loaded) return;
      if (debounce) return;
      debounce = true;

      Events.data.set("lastCoinRefresh", os.time());
      Events.data.increment("coins", this.attributes.CoinPickup_Worth);
    }));

    this.janitor.Add(Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "lastCoinRefresh")) return;
      if (os.time() - <number>value >= 24 * 60 * 60) return; // if it's been 24 or more hours then keep the coin
      this.destroy();
    }));

    const defaultOrientation = this.instance.Orientation;
    const defaultPosition = this.instance.Position;
    task.spawn(() => {
      while (!destroyed) {
        tween(this.instance, tweenInfo, {
          Orientation: defaultOrientation.add(new Vector3(0, 180, 0)),
          Position: defaultPosition.add(new Vector3(0, 1, 0))
        }).Completed.Wait();
        tween(this.instance, tweenInfo, {
          Orientation: defaultOrientation.add(new Vector3(0, 360, 0)),
          Position: defaultPosition
        }).Completed.Wait();
      }
    });

    loaded = true;
  }
}