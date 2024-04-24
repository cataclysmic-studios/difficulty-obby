import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";

import { Events } from "server/network";

import type { DatabaseService } from "server/services/third-party/database";
import type { LeaderstatsService } from "server/services/leaderstats";
import Log from "shared/logger";

@Component({ tag: "Checkpoint" })
export class Checkpoint extends BaseComponent<{}, SpawnLocation> implements OnStart {
  public constructor(
    private readonly db: DatabaseService,
    private readonly leaderstats: LeaderstatsService
  ) { super(); }

  public onStart(): void {
    this.instance.Duration = 0;
    this.instance.Touched.Connect(async hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      const player = Players.GetPlayerFromCharacter(character);
      if (humanoid === undefined || player === undefined) return;

      const checkpointStage = tonumber(this.instance.Name)!;
      const currentStage = this.leaderstats.getValue<number>("Stage");
      const topStage = this.db.get<number>(player, "stage");
      if (currentStage > topStage)
        player.Kick("take a look at yourself, hacking on a roblox obby");

      if (currentStage >= checkpointStage || checkpointStage - 1 !== currentStage) return;
      Events.playSoundEffect(player, "StageCompleted");

      if (checkpointStage > topStage) {
        this.db.set<number>(player, "stage", checkpointStage);
        return Events.incrementStageOffset(player);
      } else if (checkpointStage > currentStage)
        return Events.incrementStageOffset(player);

      Log.warning("you should not be seeing this");
      // const scaling = checkpointStage ** 0.25;
      // const coinsReward = math.round((new Random).NextNumber(scaling * checkpointStage * 1.5, scaling * 15) / 2);
      // this.db.increment(player, "coins", coinsReward);
    });
  }
}