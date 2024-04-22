import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players, Workspace as World } from "@rbxts/services";

import type { DatabaseService } from "server/services/third-party/database";

@Component({ tag: "Checkpoint" })
export class Checkpoint extends BaseComponent<{}, SpawnLocation> implements OnStart {
  public constructor(
    private readonly db: DatabaseService
  ) { super(); }

  public onStart(): void {
    this.instance.Duration = 0;
    this.instance.Touched.Connect(async hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      const player = Players.GetPlayerFromCharacter(character);
      if (humanoid === undefined || player === undefined) return;

      const allSpawns = World.GetDescendants().filter((i): i is SpawnLocation => i.IsA("SpawnLocation"));
      for (const spawn of allSpawns)
        spawn.Enabled = spawn.Name === this.instance.Name;

      const checkpointStage = tonumber(this.instance.Name)!;
      const currentStage = this.db.get<number>(player, "stage", 0);
      if (currentStage >= checkpointStage || checkpointStage - 1 !== currentStage) return;
      this.db.set<number>(player, "stage", checkpointStage);

      const scaling = checkpointStage ** 0.75;
      const coinsReward = math.round((new Random).NextNumber(scaling * checkpointStage * 1.5, scaling * 15));
      this.db.increment(player, "coins", coinsReward);
    });
  }
}