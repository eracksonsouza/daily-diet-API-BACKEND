import { beforeAll, afterAll, beforeEach } from "vitest";
import { database } from "../database";

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  await database.migrate.latest();
});

beforeEach(async () => {
  await database("meals").del();
  await database("users").del();
});

afterAll(async () => {
  await database.destroy();
});
