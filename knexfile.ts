import type { Knex } from "knex";
import { config } from "./src/database.js";

const knexConfig: Knex.Config = config;

export default knexConfig;
