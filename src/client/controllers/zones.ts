import { Controller, type OnInit } from "@flamework/core";
import { endsWith } from "@rbxts/string-utils";
import Signal from "@rbxts/signal";

import { Events } from "client/network";
import { getZoneName, STAGES_PER_ZONE } from "shared/constants";

@Controller()
export class ZonesController implements OnInit {
  public readonly discovered = new Signal<(zoneName: string) => void>;

  private lastZoneName?: string;

  public onInit(): void {
    Events.data.updated.connect((directory, value) => {
      if (!endsWith(directory, "stage")) return;

      const stage = <number>value;
      const zoneName = getZoneName(stage);
      if (zoneName === this.lastZoneName) return;
      this.lastZoneName = zoneName;

      if (stage % (STAGES_PER_ZONE + 1) !== 0) return;
      this.discovered.Fire(zoneName);
    });
  }
}