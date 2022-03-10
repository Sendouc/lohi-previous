import { BotCommand } from "..";
import ids from "../utils/ids";

const groupedLinks = {
  sg: {
    seeking: [
      "https://cdn.discordapp.com/attachments/865925063731445760/865925984065552404/SG_NT_Seeking.png",
      "https://cdn.discordapp.com/attachments/865925063731445760/865926005776056360/SG_HT_Seeking.png",
    ],
    grillers: [
      "https://cdn.discordapp.com/attachments/951441475034558484/951441708745388062/SG_NT_Grillers.png",
      "https://cdn.discordapp.com/attachments/951441475034558484/951441742283018291/SG_HT_Grillers.png",
    ],
    rush: [
      "https://cdn.discordapp.com/attachments/951442362775765022/951442493927485450/SG_NT_Rush.png",
      "https://cdn.discordapp.com/attachments/951442362775765022/951442573971578880/SG_HT_Rush.png",
    ],
  },
  mb: {
    seeking: [
      "https://cdn.discordapp.com/attachments/865925063731445760/865926250963140628/MB_NT_Seeking.png",
      "https://cdn.discordapp.com/attachments/865925063731445760/865926264409030696/MB_HT_Seeking.png",
    ],
    grillers: [
      "https://cdn.discordapp.com/attachments/951441475034558484/951441787573141534/MB_NT_Grillers.png",
      "https://cdn.discordapp.com/attachments/951441475034558484/951441828299817020/MB_HT_Grillers.png",
    ],
    rush: [
      "https://cdn.discordapp.com/attachments/951442362775765022/951442753563291688/MB_NT_Rush.png",
      "https://cdn.discordapp.com/attachments/951442362775765022/951442772345356288/MB_HT_Rush.png",
    ],
  },
  lo: {
    seeking: [
      "https://cdn.discordapp.com/attachments/865925063731445760/865926336199655424/LO_NT_Seeking.png",
      "https://cdn.discordapp.com/attachments/865925063731445760/865926346545954836/LO_HT_Seeking.png",
    ],
    grillers: [
      "https://cdn.discordapp.com/attachments/951441475034558484/951441880841854986/LO_NT_Grillers.png",
      "https://cdn.discordapp.com/attachments/951441475034558484/951441897052864532/LO_HT_Grillers.png",
    ],
    rush: [
      "https://cdn.discordapp.com/attachments/951442362775765022/951442800166174782/LO_NT_Rush.png",
      "https://cdn.discordapp.com/attachments/951442362775765022/951442813596360714/LO_HT_Rush.png",
    ],
  },
  ss: {
    seeking: [
      "https://cdn.discordapp.com/attachments/865925063731445760/865926389223784468/SS_NT_Seeking.png",
      "https://cdn.discordapp.com/attachments/865925063731445760/865926397561798656/SS_HT_Seeking.png",
    ],
    grillers: [
      "https://cdn.discordapp.com/attachments/951441475034558484/951441959510233118/SS_NT_Grillers.png",
      "https://cdn.discordapp.com/attachments/951441475034558484/951441974198698005/SS_HT_Grillers.png",
    ],
    rush: [
      "https://cdn.discordapp.com/attachments/951442362775765022/951442852485935164/SS_NT_Rush.png",
      "https://cdn.discordapp.com/attachments/951442362775765022/951442864305479710/SS_HT_Rush.png",
    ],
  },
  ap: {
    seeking: [
      "https://cdn.discordapp.com/attachments/865925063731445760/865926537629663242/AP_NT_Seeking.png",
      "https://cdn.discordapp.com/attachments/865925063731445760/865926546635620382/AP_HT_Seeking.png",
    ],
    grillers: [
      "https://cdn.discordapp.com/attachments/951441475034558484/951442012626878514/AP_NT_Grillers.png",
      "https://cdn.discordapp.com/attachments/951441475034558484/951442021246201906/AP_HT_Grillers.png",
    ],
    rush: [
      "https://cdn.discordapp.com/attachments/951442362775765022/951442890721206312/AP_NT_Rush.png",
      "https://cdn.discordapp.com/attachments/951442362775765022/951442901219561472/AP_HT_Rush.png",
    ],
  },
  fundamentals:
    "https://docs.google.com/document/d/1WTDiKSzV3SaD8Sn7wWlGreE2Y4Y7UrOv3SSv7qtzvcg/edit?usp=sharing",
  fundamentals2: "https://youtu.be/BvGbmLO94Po",
  advanced:
    "https://docs.google.com/document/d/16wcdlxqwqBvOnXIviB_ig0FS5_a96DKwYUIiGh6YHa8/edit?usp=sharing",
  spawns:
    "https://cdn.discordapp.com/attachments/836884751922757652/836886520250105886/SR_Time_Interval.png",
  ballpoint: "https://youtu.be/oSf39Yn0wOU",
  explo: "https://youtu.be/1qSW0_fA_L4",
  dynamo: "https://youtu.be/GrCCAI8giKc",
  bamboo: "https://youtu.be/yptwgqIoYiI",
  hydra: "https://youtu.be/_YduyOTVoLk",
} as const;

const validCommands = Object.keys(groupedLinks)
  .flatMap((parentKey) => {
    // @ts-expect-error
    const value = groupedLinks[parentKey];
    if (typeof value === "string") {
      return parentKey;
    } else {
      return Object.keys(value).map((key) => `${parentKey} ${key}`);
    }
  })
  .map((command) => `!q ${command}`);

const questionCommand: BotCommand = {
  name: "add",
  description: "Gives you the specified role",
  validGuilds: [ids.guilds.sro],
  execute: async ({ msg, args }) => {
    if (args.length === 0) {
      await msg.channel.send(
        "Available commands:\n\n" + validCommands.join("\n")
      );
      return;
    }

    let result: any = groupedLinks;
    console.log("args", args);
    for (const arg of args) {
      console.log("result", result);
      if (typeof result === "string" || !result) break;
      if (result.hasOwnProperty(arg)) {
        const value = result[arg];
        result = value;
      }
    }

    if (Array.isArray(result)) {
      result = result.join("\n");
    }

    if (typeof result !== "string") {
      await msg.channel.send(
        "Invalid parameters - use: `!q` to see the available parameters"
      );
      return;
    }

    await msg.channel.send(result);
  },
};

export default questionCommand;
