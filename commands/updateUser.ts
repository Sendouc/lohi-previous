import { BotCommand } from "..";
import { getClient } from "../client";

const updateUserCommand: BotCommand = {
  name: "update",
  description: "Updates the name and avatar on sendou.ink",
  execute: async (msg) => {
    console.log(msg.author);
    const res = await getClient().query("SELECT $1::text as message", [
      "Hello world!",
    ]);
    console.log(res.rows[0].message); // Hello world!
  },
};

export default updateUserCommand;
