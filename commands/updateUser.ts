import { BotCommand } from "..";

const updateUserCommand: BotCommand = {
  name: "update",
  description: "Updates the name and avatar on sendou.ink",
  execute: async (msg) => {
    await msg.react("✅");
  },
};

export default updateUserCommand;
