import { BotCommand } from "..";

const updateUserCommand: BotCommand = {
  name: "update",
  description: "Updates the name and avatar on sendou.ink",
  execute: async ({ msg, prisma }) => {
    await prisma.user.update({
      where: { discordId: msg.author.id },
      data: {
        username: msg.author.username,
        discriminator: msg.author.discriminator,
        discordAvatar: msg.author.avatar,
      },
    });
    await msg.react("✅");
  },
};

export default updateUserCommand;
