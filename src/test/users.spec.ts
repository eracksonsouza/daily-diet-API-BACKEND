import { expect, test, beforeAll, afterAll, describe } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("Users Routes", () => {
  //antes de todos os testes eu preciso garantir que o app esteja pronto
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("The user can create a new meal.", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "Erackson Souza",
        email: "erackson.souza@example.com",
      })
      .expect(201);
  });
});
