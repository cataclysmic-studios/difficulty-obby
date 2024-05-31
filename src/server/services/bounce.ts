import { Service, type OnInit } from "@flamework/core";

import { Events } from "server/network";

@Service()
export class BounceService implements OnInit {
  public onInit(): void {
    Events.sendGlobalNotification.connect((player, message) => Events.sendNotification.broadcast(`${player} says: ${message}`));
  }
}