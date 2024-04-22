import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";
import { DatabaseService } from "server/services/third-party/database";

interface Attributes {
  readonly Checkpoint_Number: number;
}

@Component({ tag: "Checkpoint" })
export class Checkpoint extends BaseComponent<Attributes, BasePart> implements OnStart {
  public constructor(
    private readonly db: DatabaseService
  ) { super(); }

  public onStart(): void {
    this.instance.Touched.Connect(async hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      const player = Players.GetPlayerFromCharacter(character);
      if (humanoid === undefined || player === undefined) return;

      const stageNumber = this.attributes.Checkpoint_Number;
      const currentStage = this.db.get<number>(player, "stage");
      if (currentStage >= stageNumber || stageNumber - 1 !== currentStage) return;
      this.db.set<number>(player, "stage", stageNumber)
    });
  }
}