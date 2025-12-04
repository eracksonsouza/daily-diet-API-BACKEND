import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("tsx", pathToFileURL("./"));

const { config } = await import("./src/database.ts");
export default config;
