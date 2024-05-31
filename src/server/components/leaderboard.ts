import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";
import Object from "@rbxts/object-utils";

import { Assets } from "shared/utility/instances";
import { commaFormat, toSuffixedNumber } from "shared/utility/numbers";

import type { DatabaseService } from "server/services/third-party/database";
import { slice } from "shared/utility/array";
import Log from "shared/logger";

const TOP_PLAYERS = 100;

interface Attributes { }

@Component({ tag: "Leaderboard" })
export class Leaderboard extends BaseComponent<Attributes, BasePart> implements OnStart {
  public constructor(
    private readonly db: DatabaseService
  ) { super(); }

  public onStart(): void {
    const database = slice(
      Object.entries(this.db.getDatabase())
        .sort(([_, dataA], [__, dataB]) => dataA.stage > dataB.stage)
        .filter(([idString]) => tonumber(idString) !== undefined && tonumber(idString)! > 0),

      0, TOP_PLAYERS
    );

    const ui = Assets.UI.LeaderboardUI.Clone();
    ui.Adornee = this.instance;
    ui.Parent = this.instance;

    for (const frame of ui.List.GetChildren().filter(i => i.IsA("Frame")))
      frame.Destroy();

    for (const player of database) {
      const [idString, data] = player;
      const index = database.indexOf(player);
      const id = tonumber(idString)!;
      task.wait(0.2);
      const [success, username] = pcall(() => Players.GetNameFromUserIdAsync(id));
      if (!success) return Log.warning(<string>username);

      const entry = Assets.UI.LeaderboardEntry.Clone();
      entry.Username.Text = username;
      entry.Stage.Text = commaFormat(data.stage ?? 0);
      entry.Coins.Text = toSuffixedNumber(data.coins ?? 0);
      entry.LayoutOrder = index;
      entry.Parent = ui.List;
    }
  }
}