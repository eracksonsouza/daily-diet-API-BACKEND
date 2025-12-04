import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.text("name").notNullable();
    table.text("email").notNullable().unique();
    table.uuid("session_id").notNullable().index();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary();
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index();
    table.text("name").notNullable();
    table.text("description").nullable();
    table.timestamp("date_time").notNullable().index();
    table.boolean("is_on_diet").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
  await knex.schema.dropTable("users");
}
