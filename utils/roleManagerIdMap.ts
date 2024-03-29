import ids from "./ids";

const roleManagerIdMap: Record<string, Record<string, string>> = {
  [ids.guilds.sro]: {
    lfg: ids.roles.sroLfg,
    coach: ids.roles.sroCoach,
  },
  [ids.guilds.plusServer]: {
    pings2: ids.roles.plusTwoPings,
    pings3: ids.roles.plusThreePings,
  },
} as const;

export default roleManagerIdMap;
