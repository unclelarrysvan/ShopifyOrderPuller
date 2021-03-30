const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
  client: 'pg',
  useNullAsDefault: true,
  connection: process.env.DATABASE_URL
})

Model.knex(knex);

class Dropshipper extends Model {
  static get tableName() {
    return 'dropshippers';
  }

  async $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

async function createSchema() {
  if (await knex.schema.hasTable('dropshippers')) {
    return;
  }

  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema.createTable('dropshippers', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('shopify_vendor');
    table.timestamps();
  });
}
createSchema();

module.exports = Dropshipper;

