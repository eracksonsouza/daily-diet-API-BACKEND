import { expect, test, beforeAll, afterAll, describe } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("Metrics Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("The user can obtain meal metrics", async () => {
    //cria um usuario primeiro
    await request(app.server)
      .post("/users")
      .send({
        name: "Maria Oliveira",
        email: "maria.oliveira@example.com",
      })
      .expect(201);
  });
});
