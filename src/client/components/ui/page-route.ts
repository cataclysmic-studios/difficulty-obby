import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";

import { PlayerGui } from "shared/utility/client";

import DestroyableComponent from "shared/base-components/destroyable";

interface Attributes {
  PageRoute_Destination: string;
  PageRoute_Exclusive: boolean; // whether or not all other pages should be disabled when destination page is reached
}

@Component({
  tag: "PageRoute",
  ancestorWhitelist: [PlayerGui],
  defaults: {
    PageRoute_Exclusive: true
  }
})
export class PageRoute extends DestroyableComponent<Attributes, GuiButton> implements OnStart {
  public onStart(): void {
    this.janitor.Add(this.instance.MouseButton1Click.Connect(() => {
      this.setPage();
    }));
  }

  private setPage(destination = this.attributes.PageRoute_Destination, exclusive = this.attributes.PageRoute_Exclusive) {
    const screen = this.instance.FindFirstAncestorOfClass("ScreenGui")!;
    const frames = screen.GetChildren().filter((i): i is Frame => i.IsA("Frame"));
    const destinationFrame = <Frame>screen.WaitForChild(destination);
    if (exclusive)
      for (const frame of frames) {
        if (frame === destinationFrame) continue;
        frame.Visible = false;
      }

    destinationFrame.Visible = true;
  }
}