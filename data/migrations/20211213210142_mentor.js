exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('mentor', function (table) {
      table.increments('mentor_id').notNullable().unique().primary();
      table.string('name').notNullable();
      table.string('location').notNullable();
      table.string('email').notNullable();
      table.string('tech_stack').notNullable();
      table.string('experience_level').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('mentor');
};
