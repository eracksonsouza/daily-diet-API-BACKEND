import fastify from "fastify";
import { database } from "./database";

const app = fastify();

app.get("/hello", async () => {
  const tables = await database("sqlite_schema").select("*");

  return tables;
});

app
  .listen({
    port: 4444,
  })
  .then(() => {
    console.log("Servidor rodando na porta 4444 ");
  });
