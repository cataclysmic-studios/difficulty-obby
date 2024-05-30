import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";
import Object from "@rbxts/object-utils";

import { Assets } from "shared/utility/instances";
import { commaFormat, toSuffixedNumber } from "shared/utility/numbers";

import type { DatabaseService } from "server/services/third-party/database";

interface Attributes { }

@Component({ tag: "Leaderboard" })
export class Leaderboard extends BaseComponent<Attributes, BasePart> implements OnStart {
  public constructor(
    private readonly db: DatabaseService
  ) { super(); }

  public onStart(): void {
    const database = Object.entries(this.db.getDatabase())
      .sort(([_, dataA], [__, dataB]) => dataA.stage > dataB.stage);

    const ui = Assets.UI.LeaderboardUI.Clone();
    ui.Adornee = this.instance;
    ui.Parent = this.instance;

    for (const player of database)
      task.spawn(() => {
        const [idString, data] = player;
        const index = database.indexOf(player);
        const id = tonumber(idString)!;
        if (id === undefined || id < 0) return;

        const [success, username] = pcall(() => Players.GetNameFromUserIdAsync(id));
        if (!success) return;

        const entry = Assets.UI.LeaderboardEntry.Clone();
        entry.Username.Text = username;
        entry.Stage.Text = commaFormat(data.stage ?? 0);
        entry.Coins.Text = toSuffixedNumber(data.coins ?? 0);
        entry.LayoutOrder = index;
        entry.Parent = ui.List;
      });
  }
}