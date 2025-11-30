import { beforeAll, afterAll, beforeEach } from "vitest";
import { database } from "../database";

// Configura o ambiente de teste antes de todos os testes
beforeAll(async () => {
  // Define a variável de ambiente para teste
  process.env.NODE_ENV = "test";

  // Executa as migrations no banco de teste
  await database.migrate.latest();
});

// Limpa os dados entre cada teste
beforeEach(async () => {
  // Limpa todas as tabelas antes de cada teste
  await database("meals").del();
  await database("users").del();
});

afterAll(async () => {
  // Fecha a conexão com o banco após todos os testes
  await database.destroy();
});
