import ids from "./ids";

const roleManagerIdMap: Record<string, Record<string, string>> = {
  [ids.guilds.sro]: {
    lfg: ids.roles.sroLfg,
    coach: ids.roles.sroCoach,
  },
} as const;

export default roleManagerIdMap;
