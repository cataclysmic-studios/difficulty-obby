import { Service, type OnInit } from "@flamework/core";
import { Events } from "server/network";

const INTERVAL = 10 * 60;

@Service()
export class RaceService implements OnInit {
  public onInit(): void {
    task.spawn(() => {
      // while (true) {
      //   task.wait(INTERVAL);
      //   Events.sendRaceNotification.broadcast("Obby race is starting. Click to join!", 8);
      // }
    });
  }
}