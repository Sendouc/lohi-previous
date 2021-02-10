require("dotenv").config();

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
  execute: (msg: Discord.Message, args: string[]) => Promise<void>;
}

const client = new Discord.Client();

client.once("ready", async () => {
  console.log(`${client.user!.username}#${client.user!.discriminator} ready!`);
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

  try {
    await commands[commandName].execute(msg, args);
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
