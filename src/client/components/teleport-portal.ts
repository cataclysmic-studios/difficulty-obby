import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { CollectionService } from "@rbxts/services";

import { Player } from "shared/utility/client";
import Log from "shared/logger";

import type { CheckpointsController } from "client/controllers/checkpoints";
import type { UIEffectsController } from "client/controllers/ui-effects";
import { Events } from "client/network";

interface Attributes {
  readonly TeleportPortal_DestinationTag: string;
}

@Component({ tag: "TeleportPortal" })
export class TeleportPortal extends BaseComponent<Attributes, PortalModel> implements OnStart {
  public constructor(
    private readonly checkpoints: CheckpointsController,
    private readonly uiEffects: UIEffectsController
  ) { super(); }

  public onStart(): void {
    let debounce = false;

    this.instance.Collider.Touched.Connect(async hit => {
      const character = hit.FindFirstAncestorOfClass("Model");
      const humanoid = character?.FindFirstChildOfClass("Humanoid");
      if (humanoid === undefined) return;
      if (character?.Name !== Player.Name) return;
      if (debounce) return;
      debounce = true;
      task.delay(1, () => debounce = false);

      const root = humanoid.RootPart;
      if (root === undefined) return;

      const defaultWalkSpeed = 16;
      const defaultJumpHeight = humanoid.JumpHeight;
      const fadeTime = 0.5;
      humanoid.WalkSpeed = 0;
      humanoid.JumpHeight = 0;
      task.delay(fadeTime, () => {
        const destinationParts = <Part[]>CollectionService.GetTagged(this.attributes.TeleportPortal_DestinationTag);
        let destinationPart: Part;
        if (destinationParts.size() <= 1) {
          destinationPart = destinationParts[0];
          if (destinationPart === undefined)
            return Log.warning(`Failed to find destination part for TeleportPortal, tag was "${this.attributes.TeleportPortal_DestinationTag}"`);
        } else
          destinationPart = destinationParts[math.random(0, destinationParts.size() - 1)];

        root.CFrame = destinationPart.CFrame.add(new Vector3(0, 6, 0));
        humanoid.WalkSpeed = defaultWalkSpeed;
        humanoid.JumpHeight = defaultJumpHeight;

        this.checkpoints.setInLobby(false, true);
        if (this.instance.HasTag("PvPPortal")) {
          Events.tools.addItemToBackpack("PvPSword", "ExtraItems", true);
          this.checkpoints.inLobbyUpdated.Once((_, onlyUpdateButton) => {
            if (onlyUpdateButton) return;
            Events.tools.updateBackpack();
          });
        }
      });

      this.uiEffects.blackFade(false, 0.75, fadeTime);
    });
  }
}