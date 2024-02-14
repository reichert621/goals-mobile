import { init } from "@instantdb/react-native";

export const APP_ID = "776cf290-5f95-40e1-b28e-ebdff591af24";

export type Goal = {
  id?: string;
  name: string;
  cadence: "eoy" | "monthly" | "weekly" | "daily";
  type: "number" | "binary" | "aggregate";
  value: number;
  unit: string | null;
  question?: string | null;
};
export type Log = {
  id?: string;
};
export type Schema = {
  goals: Goal;
  logs: Log;
};

export const db = init<Schema>({ appId: APP_ID });

const { auth, useAuth, useQuery, transact } = db;

export { auth, useAuth, useQuery, transact };
export default db;
