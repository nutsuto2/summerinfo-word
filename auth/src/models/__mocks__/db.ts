import { newDb } from "pg-mem";
import { config } from "../db-config";

const mem = newDb();

export default mem.adapters.createKnex(0, config) as typeof import("knex");
