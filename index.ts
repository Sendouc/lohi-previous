require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import { updateAllAction } from "commands/updateAllUsers";
import { updatePatreonAction } from "commands/updatePatreon";
import * as Discord from "discord.js";
import * as commands from "./commands";
import onNewMessage from "./onNewMessage";
import ids from "./utils/ids";

const DEFAULT_PREFIX = "!" as const;

export interface BotCommand {
  name: string;
  description: string;
  validGuilds?: string[];
  adminOnly?: boolean;
  execute: (commandParameters: {
    msg: Discord.Message;
    args: string[];
    prisma: PrismaClient;
    client: Discord.Client;
  }) => Promise<void>;
}

const client = new Discord.Client();

setInterval(updateAllAction, 12 * 3600 * 1000); // 12 hours
setInterval(updatePatreonAction, 24 * 3600 * 1000); // 24 hours

let prisma: PrismaClient | undefined;

client.once("ready", async () => {
  prisma = new PrismaClient();
  console.log(`${client.user!.username}#${client.user!.discriminator} ready!`);
});

client.on("guildMemberAdd", async (member) => {
  try {
    if (member.guild.id !== ids.guilds.plusServer || !prisma) return;

    const memberStatus = await prisma.plusStatus.findFirst({
      where: {
        user: { discordId: member.id },
      },
    });
    if (!memberStatus) {
      await member.send("You don't currently have access to +1, +2 or +3.");
      return;
    }

    const tierToGive = Math.min(
      memberStatus.vouchTier ?? Infinity,
      memberStatus.membershipTier ?? Infinity
    );
    if (tierToGive === Infinity) return;

    const roleIdToGive = [
      null,
      ids.roles.plusOne,
      ids.roles.plusTwo,
      ids.roles.plusThree,
    ][tierToGive];

    await member.roles.add(roleIdToGive!);
  } catch (e) {
    console.error(e);
  }
});

client.on("message", async (msg) => {
  const action = onNewMessage(msg);

  // some channels get listened and every message triggers a special action
  // e.g. delete message if it doesn't follow specified formatting
  // on these channels normal commands don't work
  if (action) {
    action();
    return;
  }

  // You can only use the bot in DM's or certain whitelisted channels
  if (
    msg.channel.type !== "dm" &&
    !ids.channels.bot.includes(msg.channel.id as any)
  ) {
    return;
  }

  if (!msg.content.startsWith(DEFAULT_PREFIX)) {
    return;
  }

  const args = msg.content
    .toLowerCase()
    .slice(DEFAULT_PREFIX.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift();
  if (!commandName || !isValidCommand(commandName)) return;

  if (commands[commandName].adminOnly && msg.author.id !== ids.users.admin) {
    return;
  }

  // should not happen
  if (!prisma) {
    console.error("unexpected no prisma");
    return;
  }

  try {
    await commands[commandName].execute({ msg, args, prisma, client });
  } catch (error) {
    console.error(error);
  }
});

client
  .login(process.env.DISCORD_BOT_TOKEN)
  .catch((e) => console.error(e.message));

function isValidCommand(command: string): command is keyof typeof commands {
  return commands.hasOwnProperty(command);
}
