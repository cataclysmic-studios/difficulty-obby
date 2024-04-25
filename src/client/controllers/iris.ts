import { Controller, type OnStart } from "@flamework/core";
import Signal from "@rbxts/signal";
import Iris from "@rbxts/iris";

@Controller({ loadOrder: 3 })
export class IrisController implements OnStart {
  public readonly initialized = new Signal;

  public onStart(): void {
    Iris.Init();
    Iris.UpdateGlobalConfig(Iris.TemplateConfig.colorDark);
    Iris.UpdateGlobalConfig(Iris.TemplateConfig.sizeClear);
    this.initialized.Fire();
  }
}