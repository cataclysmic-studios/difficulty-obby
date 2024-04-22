import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
  readonly KillPart_Damage: number;
}

@Component({
  tag: "KillPart",
  defaults: {
    KillPart_Damage: 100
  }
})
export class KillPart extends BaseComponent<Attributes, BasePart> implements OnStart {
  public onStart(): void {
    this.instance.Touched.Connect(hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (humanoid === undefined) return;

      humanoid.TakeDamage(this.attributes.KillPart_Damage);
    });
  }
}