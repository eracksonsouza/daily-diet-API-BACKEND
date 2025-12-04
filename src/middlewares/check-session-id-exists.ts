import { FastifyRequest, FastifyReply } from "fastify";
import { database } from "../database";

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      return reply.status(401).send({
        error: "Não autorizado. Session ID não encontrado.",
      });
    }

    const user = await database("users")
      .where({ session_id: sessionId })
      .first();

    if (!user) {
      return reply.status(401).send({
        error: "Não autorizado. Usuário não encontrado.",
      });
    }

    request.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error("Erro ao validar sessão:", error);

    return reply.status(500).send({
      error: "Erro interno ao validar sessão.",
    });
  }
}
