import { Controller, type OnStart } from "@flamework/core";

import { Functions } from "client/network";

import type { CameraController } from "./camera";

@Controller({ loadOrder: 2 })
export class InitializationController implements OnStart {
  public constructor(
    private readonly camera: CameraController
  ) { }

  public async onStart(): Promise<void> {
    this.camera.set("Default"); // set to preferred camera
    await Functions.data.initialize();
  }
}