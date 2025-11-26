import { FastifyRequest, FastifyReply } from "fastify";
import { database } from "../database";

// RF02: Identificar usuário entre requisições
export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Validar session_id em cada requisição protegida
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      return reply.status(401).send({
        error: "Não autorizado. Session ID não encontrado.",
      });
    }

    // Buscar usuário no banco pelo session_id
    const user = await database("users")
      .where({ session_id: sessionId })
      .first();

    if (!user) {
      return reply.status(401).send({
        error: "Não autorizado. Usuário não encontrado.",
      });
    }

    // Adicionar user ao request para usar nas rotas
    request.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    // Log do erro para debug (você pode usar um logger apropriado)
    console.error("Erro ao validar sessão:", error);

    return reply.status(500).send({
      error: "Erro interno ao validar sessão.",
    });
  }
}
