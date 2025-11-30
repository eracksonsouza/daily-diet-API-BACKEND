import { expect, test, beforeAll, afterAll, describe } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("Meals Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("The user can create a new meal", async () => {
    //cria um usuario primeiro
    await request(app.server)
      .post("/users")
      .send({
        name: "João Silva",
        email: "joao.silva@example.com",
      })
      .expect(201);
  });

  test("The user can list all meals", async () => {
    //cria um usuario primeiro
    await request(app.server)
      .post("/users")
      .send({
        name: "Ana Costa",
        email: "ana.costa@example.com",
      })
      .expect(201);
  });

  test("The user can update a meal", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "Carlos Pereira",
        email: "carlos.pereira@example.com",
      })
      .expect(201);
  });

  test("The user can delete a meal", async () => {
    // 1. Create a user first
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Maria Santos",
        email: "maria.santos@example.com",
      })
      .expect(201);

    // 2. Pegar o cookie/sessionId do usuário
    const cookies = createUserResponse.headers["set-cookie"];

    // 3. Criar uma refeição para esse usuário
    const createMealResponse = await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Almoço",
        description: "Arroz e feijão",
        date: new Date().toISOString(),
        is_on_diet: true,
      })
      .expect(201);

    // 4. Get the ID of the created meal
    const id_da_refeicao = createMealResponse.body.meal.id;

    // 5. Deletar a refeição
    await request(app.server)
      .delete(`/meals/${id_da_refeicao}`)
      .set("Cookie", cookies)
      .expect(200);
  });
});
