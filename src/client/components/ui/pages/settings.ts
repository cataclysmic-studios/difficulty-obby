import type { OnStart } from "@flamework/core";
import { Component, BaseComponent, type Components } from "@flamework/components";
import { UserInputService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { Events, Functions } from "client/network";
import { PlayerGui } from "shared/utility/client";
import { Assets } from "shared/utility/instances";
import { camelCaseToSpaced } from "shared/utility/strings";

import type { ToggleSwitch } from "../widgets/toggle-switch";

type DatabaseValue = number | boolean | string | object;
type SettingData = Record<string, DatabaseValue>;

@Component({
  tag: "SettingsPage",
  ancestorWhitelist: [PlayerGui]
})
export class SettingsPage extends BaseComponent<{}, PlayerGui["Main"]["Settings"]> implements OnStart {
  private readonly syncJanitor = new Janitor;

  public constructor(
    private readonly components: Components
  ) { super(); }

  public async onStart(): Promise<void> {
    this.syncSettings();
    UserInputService.GamepadConnected.Connect(() => this.syncSettings());
    UserInputService.GamepadDisconnected.Connect(() => this.syncSettings());
  }

  private async syncSettings(): Promise<void> {
    const settings = <SettingData>await Functions.data.get("settings");

    this.syncJanitor.Cleanup();
    for (const setting of pairs(settings)) {
      let layoutOrder = 0;
      const settingFrame = this.syncJanitor.Add(Assets.UI.Setting.Clone());
      const settingPath = `settings/${setting[0]}`;
      this.createSetting(settingFrame, setting, settingPath);
      settingFrame.LayoutOrder = layoutOrder;
      settingFrame.Parent = this.instance.List;
      layoutOrder++;
    }
  }

  private createSetting(settingFrame: Frame & { Title: TextLabel; }, [settingName, settingValue]: [string, DatabaseValue], dataPath: string): void {
    settingFrame.Title.Text = camelCaseToSpaced(settingName).upper();
    switch (type(settingValue)) {
      case "boolean": {
        const toggleSwitchFrame = Assets.UI.ToggleSwitch.Clone();
        toggleSwitchFrame.AnchorPoint = new Vector2(1, 0);
        toggleSwitchFrame.Position = UDim2.fromScale(1, 0);
        toggleSwitchFrame.Parent = settingFrame;
        toggleSwitchFrame.SetAttribute("ToggleSwitch_InitialState", <boolean>settingValue);

        const toggleSwitch = this.components.addComponent<ToggleSwitch>(toggleSwitchFrame);
        toggleSwitch.toggled.Connect(on => Events.data.set(dataPath, on));
        break;
      }
      case "number": {
        // slider
        break;
      }
    }
  }
}