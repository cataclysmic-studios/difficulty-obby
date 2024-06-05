import { Controller, type OnStart } from "@flamework/core";
import { Context as InputContext } from "@rbxts/gamejoy";
import { RunService as Runtime } from "@rbxts/services";
import Object from "@rbxts/object-utils";
import Iris from "@rbxts/iris";

import { Events } from "client/network";
import { Player } from "shared/utility/client";
import { DEVELOPERS } from "shared/constants";
import { TOTAL_STAGE_COUNT } from "shared/zones";
import { removeWhitespace } from "shared/utility/strings";

import type { IrisController } from "./iris";
import type { CameraController } from "./camera";
import type { MouseController } from "./mouse";
import type { NotificationController } from "./notification";

@Controller()
export class ControlPanelController implements OnStart {
  private readonly input = new InputContext({
    ActionGhosting: 0,
    Process: false,
    RunSynchronously: true
  });

  public constructor(
    private readonly iris: IrisController,
    private readonly camera: CameraController,
    private readonly mouse: MouseController,
    private readonly notification: NotificationController
  ) { }

  public async onStart(): Promise<void> {
    const windowSize = new Vector2(500, 400);
    let open = false;

    this.input
      .Bind("Comma", () => {
        if (!Runtime.IsStudio() && !DEVELOPERS.includes(Player.UserId)) return;
        open = !open
      })
      .Bind("P", () => {
        if (!Runtime.IsStudio() && !DEVELOPERS.includes(Player.UserId)) return;
        this.mouse.behavior = this.mouse.behavior === Enum.MouseBehavior.Default ? Enum.MouseBehavior.LockCenter : Enum.MouseBehavior.Default;
        Player.CameraMode = Player.CameraMode === Enum.CameraMode.LockFirstPerson ? Enum.CameraMode.Classic : Enum.CameraMode.LockFirstPerson;
      });

    this.iris.initialized.Connect(() => Iris.Connect(() => {
      if (!open) return;
      Iris.Window(["Control Panel", false, false, false, true], { size: Iris.State(windowSize) });

      this.renderCameraTab();
      this.renderAdminTab();

      Iris.End();
    }));
  }

  private renderAdminTab(): void {
    Iris.Tree(["Admin"]);

    const lifetime = Iris.SliderNum(["Notification lifetime", 0.2, 2, 10], { number: Iris.State(4) });
    const notifText = Iris.InputText(["", "Notification message"]);
    const notifButton = Iris.Button(["Send global notification"]);
    if (notifButton.clicked()) {
      const text = notifText.state.text.get();
      if (removeWhitespace(text) === "") return;
      Events.sendGlobalNotification(text, lifetime.state.number.get());
    }

    Iris.SeparatorText(["Player"]);
    const coinsRecipient = Iris.InputText(["", "Recipient of coins (empty for self)"]);
    const addCoinsButton = Iris.Button(["Add 1,000 coins"]);
    if (addCoinsButton.clicked()) {
      const recipientName = coinsRecipient.state.text.get();
      Events.data.giveCoins(removeWhitespace(recipientName) === "" ? Player.Name : recipientName);
    }

    const stageRecipient = Iris.InputText(["", "Player to set stage (empty for self)"]);
    const stageNumber = Iris.InputNum(["Stage to set player to", 1, 0, TOTAL_STAGE_COUNT]);
    const setStageButton = Iris.Button(["Set stage"]);
    if (setStageButton.clicked()) {
      const recipientName = stageRecipient.state.text.get();
      Events.data.setStage(removeWhitespace(recipientName) === "" ? Player.Name : recipientName, stageNumber.state.number.get());
    }

    Iris.Separator();
    const nukeButton = Iris.Button(["Nuke"]);
    if (nukeButton.clicked()) {
      if (Player.UserId === 95976124) {
        for (const _ of $range(1, 12))
          this.notification.send("avert u a freak");

        return;
      }

      Events.nuke();
    }

    Iris.End();
  }

  private renderCameraTab(): void {
    Iris.Tree(["Camera"]);

    const currentCamera = this.camera.get().instance;
    const fov = Iris.SliderNum(["FOV", 0.25, 1, 120], { number: Iris.State(currentCamera.FieldOfView) });
    if (fov.numberChanged())
      currentCamera.FieldOfView = fov.state.number.get();

    const cameraComponents = Object.keys(this.camera.cameras).sort();
    const componentIndex = Iris.State<keyof typeof this.camera.cameras>(this.camera.currentName);
    Iris.Combo(["Camera Component"], { index: componentIndex });
    for (const component of cameraComponents)
      Iris.Selectable([component, component], { index: componentIndex });
    Iris.End();

    if (this.camera.currentName !== componentIndex.get())
      this.camera.set(componentIndex.get());

    Iris.End();
  }
}