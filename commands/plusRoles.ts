import { BotCommand } from "index";
import ids from "../utils/ids";

// skip WALKY and Lean
const IDS_TO_SKIP = ["79014962235707392", "86905636402495488"];

const plusRolesCommand: BotCommand = {
  name: "plus",
  description: "Update Plus roles of all users",
  adminOnly: true,
  execute: async ({ prisma, client }) => {
    const statuses = await prisma.plusStatus.findMany({
      include: { user: true },
    });
    console.log(statuses[0]);

    const guild = client.guilds.cache.get(ids.guilds.plusServer);

    const memberRoles = [
      ids.roles.plusOne,
      ids.roles.plusTwo,
      ids.roles.plusThree,
    ];

    let removed = 0;
    let added = 0;

    for (const [, member] of guild!.members.cache) {
      if (IDS_TO_SKIP.includes(member.id as any)) continue;

      const usersMemberRole = member.roles.cache.find((role) =>
        memberRoles.includes(role.id as any)
      );

      if (!usersMemberRole) continue;

      const status = statuses.find((s) => s.user.discordId === member.id);
      if (!status) throw Error("unexpected no status");

      const currentTierByRole =
        memberRoles.indexOf(usersMemberRole.id as any) + 1;

      if (!status.membershipTier) {
        await member.roles.remove(usersMemberRole);
        removed++;
      } else if (status.membershipTier !== currentTierByRole) {
        await member.roles.remove(usersMemberRole);
        removed++;
        await member.roles.add(memberRoles[status.membershipTier! - 1]);
        added++;
      }
    }

    await client.users.cache
      .get(ids.users.admin)
      ?.send(`${removed} roles removed and ${added} roles added.`);
  },
};

export default plusRolesCommand;
