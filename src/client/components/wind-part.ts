import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

@Component({ tag: "WindPart" })
export class WindPart extends BaseComponent<{}, BasePart> implements OnStart {
  public onStart(): void {
    const collider = <BasePart>this.instance.WaitForChild("WindCollider");
    collider.CanCollide = false;
  }
}