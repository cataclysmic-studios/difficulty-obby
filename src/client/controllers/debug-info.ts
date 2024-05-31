import { Controller, type OnInit } from "@flamework/core";
import { Context as InputContext } from "@rbxts/gamejoy";
import { RunService as Runtime } from "@rbxts/services";
import { Action } from "@rbxts/gamejoy/out/Actions";
import Iris from "@rbxts/iris";

import type { LogStart } from "shared/hooks";
import { Player } from "shared/utility/client";
import { DEVELOPERS } from "shared/constants";

import type { IrisController } from "./iris";
import type { ZonesController } from "./zones";
import type { MusicController } from "./music";

@Controller()
export class DebugInfoController implements OnInit, LogStart {
  private readonly input = new InputContext({
    ActionGhosting: 0,
    Process: false,
    RunSynchronously: true
  });

  public constructor(
    private readonly iris: IrisController,
    private readonly zone: ZonesController,
    private readonly music: MusicController
  ) { }

  public onInit(): void {
    const windowSize = new Vector2(300, 400);
    const openAction = new Action("Comma", {
      Repeat: 2,
      Timing: 0.3,
    });

    let open = false;
    this.input.Bind(openAction, () => {
      if (!Runtime.IsStudio() && !DEVELOPERS.includes(Player.UserId)) return;
      open = !open;
    });

    let zoneName = "...";
    this.zone.changed.Connect(newName => zoneName = newName);

    this.iris.initialized.Once(() => {
      Iris.Connect(() => {
        if (!open) return;
        Iris.Window(["Debug Info"], { size: Iris.State(windowSize) });

        Iris.Text([`<b>Current Zone:</b> ${zoneName}`, true, undefined, true]);
        Iris.Text([`<b>Current Song:</b> ${this.music.currentSong?.Name ?? "None"}`, true, undefined, true]);

        Iris.End();
      });
    });
  }
}