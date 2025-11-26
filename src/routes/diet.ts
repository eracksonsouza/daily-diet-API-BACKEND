import type { FastifyInstance, FastifyRequest } from "fastify";
import { database } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
    };
  }
}

export async function DietRoutes(app: FastifyInstance) {
  // Aplicar middleware de autenticação em todas as rotas
  app.addHook("preHandler", checkSessionIdExists);

  // RF06: Listar todas as refeições do usuário (GET /meals)
  app.get("/", async (request) => {
    // Retornar apenas refeições do usuário autenticado
    const meals = await database("meals")
      .where({ user_id: request.user!.id })
      .orderBy("date_time", "desc"); // Ordenar por data/hora (mais recente primeiro)

    return meals;
  });

  // RF03: Registrar uma refeição (POST /meals)
  app.post("/", async (request, reply) => {
    const createDietBodySchema = z.object({
      name: z.string().min(1, "Nome é obrigatório"),
      description: z.string().optional(),
      is_on_diet: z.boolean(),
      date_time: z.coerce.date().optional(),
    });

    const { name, description, is_on_diet, date_time } =
      createDietBodySchema.parse(request.body);

    // Associar refeição ao usuário autenticado
    const mealId = randomUUID();

    await database("meals").insert({
      id: mealId,
      user_id: request.user!.id, 
      name,
      description,
      is_on_diet,
      date_time: date_time || new Date(),
    });

    const meal = await database("meals").where({ id: mealId }).first();

    return reply.status(201).send({
      meal,
      message: "Refeição cadastrada com sucesso!",
    });
  });
}
