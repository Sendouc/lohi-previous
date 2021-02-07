import ids from "./ids";

const roleManagerIdMap: Record<string, Record<string, string>> = {
  [ids.guilds.sro]: {
    lfg: ids.roles.sroLfg,
  },
} as const;

export default roleManagerIdMap;
