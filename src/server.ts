import fastify from "fastify";
import { knex } from "./database";

const app = fastify();

app.get("/hello", async () => {
  const mealsDiet = await knex("meals").where({ is_on_diet: true });
  return mealsDiet;
});

app
  .listen({
    port: 4444,
  })
  .then(() => {
    console.log("Servidor rodando na porta 4444 ");
  });
