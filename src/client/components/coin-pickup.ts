import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TweenInfoBuilder } from "@rbxts/builders";
import { endsWith } from "@rbxts/string-utils";

import { Events } from "client/network";
import { tween } from "shared/utility/ui";

import type { CharacterController } from "client/controllers/character";
import type { CheckpointsController } from "client/controllers/checkpoints";
import DestroyableComponent from "shared/base-components/destroyable";
import { getZoneModel, getZoneName } from "shared/zones";
import Object from "@rbxts/object-utils";
import { flatten } from "shared/utility/array";

interface Attributes {
  readonly CoinPickup_Worth: number;
}

@Component({ tag: "CoinPickup" })
export class CoinPickup extends DestroyableComponent<Attributes, BasePart> implements OnStart {
  private touchDebounce = false;

  public constructor(
    private readonly character: CharacterController,
    private readonly checkpoints: CheckpointsController
  ) { super(); }

  public onStart(): void {
    const tweenInfo = new TweenInfoBuilder()
      .SetTime(1)
      .SetEasingStyle(Enum.EasingStyle.Linear)
      .SetEasingDirection(Enum.EasingDirection.InOut);

    let destroyed = false;
    let loaded = false;
    this.janitor.LinkToInstance(this.instance, true);
    this.janitor.Add(() => destroyed = true);

    const conn = Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "dailyCoinsClaimed")) return;
      conn.Disconnect();

      const dailyCoinsClaimed = <Record<string, number[]>>value;
      const zoneCoinsClaimed = dailyCoinsClaimed[this.getZoneName()];
      if (zoneCoinsClaimed.includes(tonumber(this.instance.Name)!))
        this.instance.Destroy();
      else
        this.listenForTouch(() => loaded);
    });

    const defaultOrientation = this.instance.Orientation;
    const defaultPosition = this.instance.Position;
    task.spawn(() => {
      while (!destroyed) {
        tween(this.instance, tweenInfo, {
          Orientation: defaultOrientation.add(new Vector3(0, 180, 0)),
          Position: defaultPosition.add(new Vector3(0, 1, 0))
        }).Completed.Wait();
        tween(this.instance, tweenInfo, {
          Orientation: defaultOrientation.add(new Vector3(0, 0, 0)),
          Position: defaultPosition
        }).Completed.Wait();
      }
    });

    loaded = true;
  }

  private listenForTouch(isLoaded: () => boolean): void {
    this.janitor.Add(this.instance.Touched.Once(hit => {
      const character = this.character.get();
      if (hit.FindFirstAncestorOfClass("Model") !== character) return;
      if (!isLoaded()) return;
      if (this.touchDebounce) return;
      this.touchDebounce = true;

      this.instance.Destroy();
      const zoneName = this.getZoneName();
      Events.data.increment("coins", this.attributes.CoinPickup_Worth);
      Events.data.addToArray(`dailyCoinsClaimed/${zoneName}`, tonumber(this.instance.Name)!);
    }));
  }

  private getZoneName(): string {
    return getZoneName(this.checkpoints.getStage());
  }
}