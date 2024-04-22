import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import type { LogStart } from "shared/hooks";

@Component({ tag: "EntrancePortal" })
export class EntrancePortal extends BaseComponent<{}, PortalModel> implements OnStart, LogStart {
  public onStart(): void {
    const zoneName = this.instance.FindFirstAncestorOfClass("Folder")!.Name;
    this.instance.ZoneName.GUI.Title.Text = zoneName;
  }
}