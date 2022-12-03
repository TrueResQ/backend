import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // public_address is actually the account hash
  return knex.schema.createTable("user", (usersTable) => {
    usersTable.increments("id");
    usersTable.string("public_address", 127).notNullable().unique();
    usersTable.string("recovery_address", 127).notNullable();
    usersTable.string("nominee", 127).notNullable();
    usersTable.string("gaurdians", 1000).notNullable();
    usersTable.string("verifier", 255).notNullable().defaultTo("");
    usersTable.string("verifier_id", 255).notNullable().defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user");
}
