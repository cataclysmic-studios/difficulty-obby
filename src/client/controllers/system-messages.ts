import { Controller, type OnInit } from "@flamework/core";
import { TextChatService } from "@rbxts/services";

const { floor } = math;

const INTERVAL = 5 * 60;

@Controller()
export class SystemMessagesController implements OnInit {
  public onInit(): void {
    const messages = [
      "Like the game and join the group for a free stage skip every 30 minutes!",
      "Invite your friends for a free 50 coins!",
      "Come back later for more zones!",
      "Join the Discord server to leave any suggestions or bug reports!",
      "If you enjoy the game, liking it helps us out a ton!",
      "Check out the products we have to offer in the shop!",
    ];

    let i = 0;
    task.wait(3);
    task.spawn(() => {
      while (true) {
        const channel = <TextChannel>TextChatService.WaitForChild("TextChannels").WaitForChild("RBXGeneral");
        const color = Color3.fromRGB(242, 231, 27);
        channel.DisplaySystemMessage(`<font color="rgb(${floor(color.R * 255)}, ${floor(color.G * 255)}, ${floor(color.B * 255)})"><b>[SYSTEM]:</b>  ${messages[i]}</font>`);
        i += 1;
        i %= messages.size();
        task.wait(INTERVAL);
      }
    });
  }
}