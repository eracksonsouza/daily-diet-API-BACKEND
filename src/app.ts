import fastify from "fastify";
import cookie from "@fastify/cookie";
import { DietRoutes } from "./routes/diet";
import { MetricsRoutes } from "./routes/metrics";
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

app.register(MetricsRoutes, {
  prefix: "/metrics",
});

export { app };
