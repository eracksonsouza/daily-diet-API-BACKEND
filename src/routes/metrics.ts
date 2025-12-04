import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { database } from "../database";

export async function MetricsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", checkSessionIdExists);

  app.get("/", async (request) => {
    const meals = await database("meals")
      .where({ user_id: request.user!.id })
      .orderBy("date_time", "asc");

    const totalMeals = meals.length;

    const mealsOnDiet = meals.filter((meal) => meal.is_on_diet === 1).length;

    const mealsOffDiet = meals.filter((meal) => meal.is_on_diet === 0).length;

    let bestSequence = 0;
    let currentSequence = 0;

    for (const meal of meals) {
      if (meal.is_on_diet === 1) {
        currentSequence++;
        if (currentSequence > bestSequence) {
          bestSequence = currentSequence;
        }
      } else {
        currentSequence = 0;
      }
    }

    return {
      totalMeals,
      mealsOnDiet,
      mealsOffDiet,
      bestOnDietSequence: bestSequence,
    };
  });

  app.get("/:userId", async (request, reply) => {
    const userIdSchema = z.object({
      userId: z.string().uuid("ID de usuário inválido"),
    });

    const { userId } = userIdSchema.parse(request.params);

    const meals = await database("meals")
      .where({ user_id: userId })
      .orderBy("date_time", "asc");

    if (meals.length === 0) {
      return reply.status(404).send({
        message: "Nenhuma refeição encontrada para este usuário.",
      });
    }

    const totalMeals = meals.length;
    const mealsOnDiet = meals.filter((meal) => meal.is_on_diet === 1).length;
    const mealsOffDiet = meals.filter((meal) => meal.is_on_diet === 0).length;

    let bestSequence = 0;
    let currentSequence = 0;
    for (const meal of meals) {
      if (meal.is_on_diet === 1) {
        currentSequence++;
        if (currentSequence > bestSequence) {
          bestSequence = currentSequence;
        }
      } else {
        currentSequence = 0;
      }
    }

    return {
      userId,
      totalMeals,
      mealsOnDiet,
      mealsOffDiet,
      bestOnDietSequence: bestSequence,
    };
  });
}
