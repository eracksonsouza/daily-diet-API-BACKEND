import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { database } from "../database";

export async function MetricsRoutes(app: FastifyInstance) {
  // Aplicar middleware de autenticação em todas as rotas
  app.addHook("preHandler", checkSessionIdExists);

  // RF08: Obter métricas das refeições do usuário (GET /metrics)
  app.get("/", async (request) => {
    // Buscar todas as refeições do usuário autenticado, ordenadas por data/hora
    const meals = await database("meals")
      .where({ user_id: request.user!.id })
      .orderBy("date_time", "asc"); // Ordenar cronologicamente para calcular sequências

    // 1. Total de refeições registradas
    const totalMeals = meals.length;

    // 2. Total de refeições dentro da dieta
    const mealsOnDiet = meals.filter((meal) => meal.is_on_diet === 1).length;

    // 3. Total de refeições fora da dieta
    const mealsOffDiet = meals.filter((meal) => meal.is_on_diet === 0).length;

    // 4. Melhor sequência de refeições dentro da dieta
    let bestSequence = 0;
    let currentSequence = 0;

    for (const meal of meals) {
      if (meal.is_on_diet === 1) {
        currentSequence++;
        if (currentSequence > bestSequence) {
          bestSequence = currentSequence;
        }
      } else {
        currentSequence = 0; // Reseta a sequência quando encontra uma refeição fora da dieta
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

    // Buscar refeições do usuário especifico ordenadas por data/hora
    const meals = await database("meals")
      .where({ user_id: userId })
      .orderBy("date_time", "asc");

    if (meals.length === 0) {
      return reply.status(404).send({
        message: "Nenhuma refeição encontrada para este usuário.",
      });
    }

    // Cálculos das métricas...
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
