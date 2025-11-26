import { database } from "../src/database";

async function runMigrations() {
  console.log("🔄 Executando migrations...");

  try {
    await database.migrate.latest();
    console.log("✅ Migrations executadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar migrations:", error);
  } finally {
    await database.destroy();
  }
}

runMigrations();
