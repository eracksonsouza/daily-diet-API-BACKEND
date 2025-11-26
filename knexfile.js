// Este arquivo carrega a configuração TypeScript
import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Registra o tsx para carregar arquivos TypeScript
register("tsx", pathToFileURL("./"));

// Importa e exporta a configuração do arquivo TS
const { config } = await import("./src/database.ts");
export default config;
