import { Controller, type OnInit } from "@flamework/core";
import { TextChatService } from "@rbxts/services";

const { floor } = math;

@Controller()
export class SystemMessagesController implements OnInit {
  public onInit(): void {
    const messages = [
      "Like the game and join the group for a free stage skip every 30 minutes!",
      "Invite your friends for a free 50 coins!",
      "Join the Discord server to leave any suggestions!",
      "If you find a bug, we'd very much appreciate if you let us know!"
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
        task.wait(300);
      }
    });
  }
}