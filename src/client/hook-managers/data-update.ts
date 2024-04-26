import { Controller, Modding, type OnInit } from "@flamework/core";

import type { OnDataUpdate } from "client/hooks";
import { Events } from "client/network";

@Controller({ loadOrder: 1 })
export class DataUpdateController implements OnInit {
  public onInit(): void {
    const dataUpdateListeners = new Set<OnDataUpdate>;
    Modding.onListenerAdded<OnDataUpdate>(object => dataUpdateListeners.add(object));
    Modding.onListenerRemoved<OnDataUpdate>(object => dataUpdateListeners.delete(object));

    Events.data.updated.connect((directory, value) => {
      for (const listener of dataUpdateListeners)
        listener.onDataUpdate(directory, value);
    });
  }
}