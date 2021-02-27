import ids from "../utils/ids";
import { BotCommand } from "..";
import { User } from "@prisma/client";

const GUILDS_TO_FETCH_FROM = [ids.guilds.plusServer, ids.guilds.sendou];

const updateAllUsersCommand: BotCommand = {
  name: "updateall",
  description: "Updates the name and avatar on sendou.ink of everyone possible",
  adminOnly: true,
  execute: async ({ client, prisma }) => {
    const users = await prisma.user.findMany({});
    const toUpdate: Pick<
      User,
      "username" | "discriminator" | "discordAvatar" | "discordId"
    >[] = [];
    for (const guildId of GUILDS_TO_FETCH_FROM) {
      const guild = client.guilds.cache.get(guildId);

      for (const [, member] of guild!.members.cache) {
        console.log({ member, u: users[0] });
        const userFound = users.find((u) => u.discordId === member.id);
        if (!userFound) continue;

        if (
          userFound.username !== member.user.username ||
          userFound.discriminator !== member.user.discriminator ||
          userFound.discordAvatar !== member.user.avatar ||
          true
        ) {
          toUpdate.push({
            username: member.user.username,
            discriminator: member.user.discriminator,
            discordAvatar: member.user.avatar,
            discordId: member.user.id,
          });
        }
      }
    }

    await Promise.all(
      toUpdate.map(({ discordId, ...data }) =>
        prisma.user.update({ where: { discordId }, data })
      )
    );

    await client.users.cache
      .get(ids.users.admin)
      ?.send(`${toUpdate.length} users updated`);
  },
};

export default updateAllUsersCommand;
