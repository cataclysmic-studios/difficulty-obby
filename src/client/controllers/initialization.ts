import { Controller, type OnStart } from "@flamework/core";

import { Events } from "client/network";
import type { CameraController } from "./camera";

@Controller()
export class InitializationController implements OnStart {
  public constructor(
    private readonly camera: CameraController
  ) { }

  public onStart(): void {
    Events.data.initialize();
    this.camera.set("Default"); // set to preferred camera
  }
}