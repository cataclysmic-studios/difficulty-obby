import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";
import { endsWith } from "@rbxts/string-utils";

import { Events } from "client/network";
import { tween } from "shared/utility/ui";

import DestroyableComponent from "shared/base-components/destroyable";
import type { CharacterController } from "client/controllers/character";

interface Attributes {
  readonly CoinPickup_Worth: number;
}

@Component({ tag: "CoinPickup" })
export class CoinPickup extends DestroyableComponent<Attributes, BasePart> implements OnStart {
  private readonly tweenInfo = new TweenInfoBuilder()
    .SetTime(1)
    .SetEasingStyle(Enum.EasingStyle.Linear)
    .SetEasingDirection(Enum.EasingDirection.InOut);

  private touchDebounce = false;

  public constructor(
    private readonly character: CharacterController
  ) { super(); }

  public onStart(): void {
    let destroyed = false;
    this.janitor.LinkToInstance(this.instance, true);
    this.janitor.Add(this.instance);
    this.janitor.Add(() => destroyed = true);

    const conn = Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "dailyCoinsClaimed")) return;
      const dailyCoinsClaimed = <Record<string, number[]>>value;
      const zoneCoinsClaimed = dailyCoinsClaimed?.[this.getZoneName()];
      if (zoneCoinsClaimed?.includes(tonumber(this.instance.Name)!))
        this.instance.Destroy();
      else
        this.listenForTouch();

      conn.Disconnect();
    });

    const defaultOrientation = this.instance.Orientation;
    const defaultPosition = this.instance.Position;
    task.spawn(() => {
      while (!destroyed) {
        tween(this.instance, this.tweenInfo, {
          Orientation: defaultOrientation.add(new Vector3(0, 180, 0)),
          Position: defaultPosition.add(new Vector3(0, 1, 0))
        }).Completed.Wait();
        tween(this.instance, this.tweenInfo, {
          Orientation: defaultOrientation.add(new Vector3(0, 0, 0)),
          Position: defaultPosition
        }).Completed.Wait();
      }
    });
  }

  private listenForTouch(): void {
    this.janitor.Add(this.instance.Touched.Connect(hit => {
      const character = this.character.get();
      if (hit.FindFirstAncestorOfClass("Model") !== character) return;
      if (this.touchDebounce) return;
      this.touchDebounce = true;
      task.delay(5, () => this.touchDebounce = false);

      this.instance.Destroy();
      Events.data.increment("coins", this.attributes.CoinPickup_Worth);
      Events.data.addToArray(`dailyCoinsClaimed/${this.getZoneName()}`, tonumber(this.instance.Name)!);
    }));
  }

  private getZoneName(): string {
    return this.instance.Parent!.Parent!.Name;
  }
}