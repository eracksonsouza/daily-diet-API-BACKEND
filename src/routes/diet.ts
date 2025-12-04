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
  app.addHook("preHandler", checkSessionIdExists);

  app.get("/", async (request) => {
    const meals = await database("meals")
      .where({ user_id: request.user!.id })
      .orderBy("date_time", "desc");

    return meals;
  });

  app.get("/:mealId", async (request, reply) => {
    const IdParamSchema = z.object({
      mealId: z.string().uuid("ID de refeição inválido"),
    });

    const { mealId } = IdParamSchema.parse(request.params);
    const meal = await database("meals")
      .where({ id: mealId, user_id: request.user!.id })
      .first();

    if (!meal) {
      return reply.status(404).send({ message: "Refeição não encontrada." });
    }

    return meal;
  });

  app.post("/", async (request, reply) => {
    const createDietBodySchema = z.object({
      name: z.string().min(1, "Nome é obrigatório"),
      description: z.string().optional(),
      is_on_diet: z.boolean(),
      date_time: z.coerce.date().optional(),
    });

    const { name, description, is_on_diet, date_time } =
      createDietBodySchema.parse(request.body);

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

  app.put("/:mealId", async (request, reply) => {
    const updateMealsSchema = z.object({
      name: z.string().min(1, "Nome é obrigatório"),
      description: z.string().optional(),
      is_on_diet: z.boolean(),
      date_time: z.coerce.date().optional(),
    });

    const { name, description, is_on_diet, date_time } =
      updateMealsSchema.parse(request.body);

    const getMealParamsSchema = z.object({
      mealId: z.string().uuid("ID de refeição inválido"),
    });

    const { mealId } = getMealParamsSchema.parse(request.params);

    const meal = await database("meals")
      .where({ id: mealId, user_id: request.user!.id })
      .first();

    if (!meal) {
      return reply.status(404).send({ message: "Refeição não encontrada." });
    }

    await database("meals")
      .where({ id: mealId })
      .update({
        name,
        description,
        is_on_diet,
        date_time: date_time?.toISOString() || meal.date_time,
      });

    const updatedMeal = await database("meals").where({ id: mealId }).first();

    return reply.status(200).send({
      meal: updatedMeal,
      message: "Refeição atualizada com sucesso!",
    });
  });

  app.delete("/:mealId", async (request, reply) => {
    const deleteMealParamsSchema = z.object({
      mealId: z.string().uuid("ID de refeição inválido"),
    });

    const { mealId } = deleteMealParamsSchema.parse(request.params);
    const meal = await database("meals")
      .where({ id: mealId, user_id: request.user!.id })
      .first();

    if (!meal) {
      return reply.status(404).send({ message: "Refeição não encontrada." });
    }

    await database("meals").where({ id: mealId }).delete();

    return reply.status(200).send({
      message: "Refeição deletada com sucesso!",
    });
  });
}
