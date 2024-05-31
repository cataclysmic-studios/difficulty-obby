import { Controller, type OnStart } from "@flamework/core";

import type { CameraController } from "./camera";
import { Events } from "client/network";

@Controller({ loadOrder: 100 })
export class InitializationController implements OnStart {
  public constructor(
    private readonly camera: CameraController
  ) { }

  public async onStart(): Promise<void> {
    this.camera.set("Default"); // set to preferred camera
    Events.data.initialize();
  }
}