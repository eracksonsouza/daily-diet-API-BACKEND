import type { FastifyInstance } from "fastify";
import { database } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";

export async function UsersRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return await database("users").select("*");
  });

  // RF01: Criar um novo usuário (POST /users)
  app.post("/", async (request, reply) => {
    // Validar dados de entrada (nome, email)
    const createUserBodySchema = z.object({
      name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
      email: z.string().email("Email inválido"),
    });

    const { name, email } = createUserBodySchema.parse(request.body);

    // Verificar se email já existe (RNF04)
    const existingUser = await database("users").where({ email }).first();

    if (existingUser) {
      return reply.status(400).send({
        error: "Email já cadastrado",
      });
    }

    // Gerar UUID único e session_id
    const userId = randomUUID();
    const sessionId = randomUUID();

    // Criar usuário no banco
    await database("users").insert({
      id: userId,
      name,
      email,
      session_id: sessionId,
    });

    // Configurar cookie com session_id (válido por 7 dias)
    reply.cookie("sessionId", sessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
      httpOnly: true, // Não acessível via JavaScript (segurança)
      secure: false, // Mudar para true em produção (HTTPS)
    });

    // Retornar dados do usuário criado
    return reply.status(201).send({
      user: {
        id: userId,
        name,
        email,
        session_id: sessionId,
      },
      message: "Usuário criado com sucesso!",
    });
  });

  app.get("/:id", async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid("ID de usuário inválido"),
    });

    const { id } = getUserParamsSchema.parse(request.params);

    const user = await database("users").where({ id }).first();

    if (!user) {
      return reply.status(404).send({
        error: "Usuário não encontrado",
      });
    }

    return {
      name: user.name,
      email: user.email,
    };
  });
}
