import { Controller, type OnInit, type OnStart } from "@flamework/core";

import { Functions } from "client/network";
import type { CameraController } from "./camera";

@Controller({ loadOrder: 1 })
export class InitializationController implements OnInit, OnStart {
  public constructor(
    private readonly camera: CameraController
  ) { }

  public async onInit(): Promise<void> {
    await Functions.data.initialize();
  }

  public onStart(): void {
    this.camera.set("Default"); // set to preferred camera
  }
}