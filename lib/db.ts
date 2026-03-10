import { init } from "@instantdb/react";
import schema from "../instant.schema";

const APP_ID =
  process.env.NEXT_PUBLIC_INSTANT_APP_ID ??
  "3ecf6572-680b-4a9b-b830-38e05e83b6e5";

export const db = init({ appId: APP_ID, schema });

export default db;

