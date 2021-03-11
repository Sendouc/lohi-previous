import { PrismaClient, User } from "@prisma/client";
import * as Discord from "discord.js";
import { BotCommand } from "..";
import ids from "../utils/ids";

export const updatePatreonAction = async ({
  prisma,
  client,
}: {
  prisma: PrismaClient;
  client: Discord.Client;
}) => {
  const users = await prisma.user.findMany({});
  const toUpdate: Pick<User, "discordId" | "patreonTier">[] = [];

  const guild = client.guilds.cache.get(ids.guilds.sendou);

  const patreonRoleIds = [
    ids.roles.patreonSupporter,
    ids.roles.patreonSupporterPlus,
    ids.roles.patreonSupporterPlusPlus,
  ];

  for (const [, member] of guild!.members.cache) {
    const userFound = users.find((u) => u.discordId === member.id);
    if (!userFound) continue;

    const patreonRole = member.roles.cache.find((role) =>
      patreonRoleIds.includes(role.id as any)
    );
    if (!patreonRole) continue;

    const patreonTier = patreonRoleIds.indexOf(patreonRole.id as any) + 1;

    toUpdate.push({
      discordId: member.user.id,
      patreonTier,
    });
  }

  await prisma.user.updateMany({ data: { patreonTier: null } });

  for (const { discordId, ...data } of toUpdate) {
    await prisma.user.update({ where: { discordId }, data });
  }

  await client.users.cache
    .get(ids.users.admin)
    ?.send(`${toUpdate.length} users updated`);
};

const updatePatreonCommand: BotCommand = {
  name: "patreon",
  description: "Update Patreon statuses of all users",
  adminOnly: true,
  execute: async ({ client, prisma }) => {
    updatePatreonAction({ client, prisma });
  },
};

export default updatePatreonCommand;
