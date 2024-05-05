import { Controller, type OnStart } from "@flamework/core";
import { Context as InputContext } from "@rbxts/gamejoy";
import { RunService as Runtime } from "@rbxts/services";
import Object from "@rbxts/object-utils";
import Iris from "@rbxts/iris";

import { Player } from "shared/utility/client";
import { DEVELOPERS } from "shared/constants";

import type { IrisController } from "./iris";
import type { CameraController } from "./camera";
import type { MouseController } from "./mouse";

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
    private readonly mouse: MouseController
  ) { }

  public async onStart(): Promise<void> {
    const windowSize = new Vector2(300, 400);
    let open = false;

    this.input
      .Bind("RightShift", () => {
        if (!Runtime.IsStudio() && !DEVELOPERS.includes(Player.UserId)) return;
        open = !open;
      })
      .Bind("P", () => {
        if (!Runtime.IsStudio() && !DEVELOPERS.includes(Player.UserId)) return;
        this.mouse.behavior = this.mouse.behavior === Enum.MouseBehavior.Default ? Enum.MouseBehavior.LockCenter : Enum.MouseBehavior.Default;
        Player.CameraMode = Player.CameraMode === Enum.CameraMode.LockFirstPerson ? Enum.CameraMode.Classic : Enum.CameraMode.LockFirstPerson;
      });

    this.iris.initialized.Connect(() => Iris.Connect(() => {
      if (!open) return;
      Iris.Window(["Control Panel"], { size: Iris.State(windowSize) });

      this.renderCameraTab();

      Iris.End();
    }));
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