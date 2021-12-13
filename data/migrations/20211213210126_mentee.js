exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('mentee', function (table) {
      table.increments('mentee_id').notNullable().unique().primary();
      table.string('name').notNullable();
      table.string('location').notNullable();
      table.string('email').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('mentee');
};
