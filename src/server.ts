import fastify from "fastify";
import cookie from "@fastify/cookie";
import { DietRoutes } from "./routes/diet";
import { UsersRoutes } from "./routes/users";

const app = fastify();

// Registrar plugin de cookies
app.register(cookie);

// Registrar rotas
app.register(UsersRoutes, {
  prefix: "/users",
});

app.register(DietRoutes, {
  prefix: "/meals",
});

app
  .listen({
    port: 4444,
  })
  .then(() => {
    console.log("Servidor rodando na porta 4444 ");
  });
