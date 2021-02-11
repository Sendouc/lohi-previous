import { BotCommand } from "..";

const updateUserCommand: BotCommand = {
  name: "update",
  description: "Updates the name and avatar on sendou.ink",
  adminOnly: true,
  execute: async (msg, _, prisma) => {
    const user = await prisma.user.findUnique({
      where: { discordId: msg.author.id },
    });
    console.log("user", user);
    await msg.channel.send(JSON.stringify(user, null, 2));
  },
};

export default updateUserCommand;
