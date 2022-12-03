import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // public_address is actually the account hash
  return knex.schema
    .createTable("user", (usersTable) => {
      usersTable.increments("id");
      usersTable.string("public_address", 127).notNullable().unique();
      usersTable.string("verifier", 255).notNullable().defaultTo("");
      usersTable.string("verifier_id", 255).notNullable().defaultTo("");
    })
    .createTable("guardian", (guardiansTable) => {
      guardiansTable.increments("id");
      guardiansTable.string("executant_address", 127).notNullable().defaultTo("");
      guardiansTable.string("verifier_id", 1000).notNullable().defaultTo("");
      guardiansTable.string("guardian_address", 127).notNullable().defaultTo("");
      guardiansTable.string("verifier", 255).notNullable().defaultTo("");
      guardiansTable.string("accepted", 5).notNullable().defaultTo("false");
      guardiansTable.string("is_nominee", 5).notNullable().defaultTo("false");
    })
    .createTable("recovery_address", (guardiansTable) => {
      guardiansTable.increments("id");
      guardiansTable.string("executant_address", 127).notNullable().defaultTo("");
      guardiansTable.string("verifier_id", 1000).notNullable().defaultTo("");
      guardiansTable.string("recovery_address", 1000).notNullable().defaultTo("");
      guardiansTable.string("verifier", 255).notNullable().defaultTo("");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user");
}
