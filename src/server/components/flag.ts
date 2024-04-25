import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
  readonly Flag_Framerate: number;
}

@Component({
  tag: "Flag",
  defaults: {
    Flag_Framerate: 24
  }
})
export class Flag extends BaseComponent<Attributes, Model> implements OnStart {
  private readonly meshes = this.instance.GetChildren().filter((i): i is MeshPart => i.IsA("MeshPart"));

  public onStart(): void {
    const waitTime = 1 / this.attributes.Flag_Framerate;
    const frames = this.meshes.size();
    task.spawn(() => {
      while (true)
        for (let i = 1; i <= frames; i++) {
          task.wait(waitTime);
          this.reset();
          const mesh = <MeshPart>this.instance.FindFirstChild(i);
          mesh.Transparency = 0;
        }
    });
  }

  private reset(): void {
    task.spawn(() => {
      for (const part of this.meshes)
        part.Transparency = 1;
    });
  }
}