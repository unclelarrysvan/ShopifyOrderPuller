const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
  client: 'pg',
  useNullAsDefault: true,
  connection: process.env.DATABASE_URL
})

Model.knex(knex);

class Order extends Model {
  static get tableName() {
    return 'orders';
  }

  async $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  itemsForVendor(vendor) {
    return JSON.parse(this.json)['line_items'].filter((item) => item['vendor'].toUpperCase() == vendor.toUpperCase())
  }

  lineItems() {
    JSON.parse(order.json)['line_items']
  }
}

async function createSchema() {
  if (await knex.schema.hasTable('orders')) {
    return;
  }

  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema.createTable('orders', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('number');
    table.text('json');
    table.timestamps();
  });
}
createSchema();

module.exports = Order;
