if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express  = require('express');
const helmet  = require('helmet');
const bodyParser = require('body-parser');
// const Order = require('./models/order');
// const User = require('./models/user');
// const routes = require('./routes');


//  Objection/Knex
const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
  client: 'pg',
  useNullAsDefault: true,
  connection: process.env.DATABASE_URL
});

// Give the knex instance to objection.
Model.knex(knex)

class Order extends Model {
  static get tableName() {
    return 'orders';
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
  });
}
createSchema();
// XXXXXXXXXXXXXXXXXXXXXXX


const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//app.use('/', routes);





// TESTING ROUTES
const router = express.Router();
const Shopify = require('shopify-api-node');

async function getShopifyOrders() {
  const shopify = new Shopify({
    shopName: process.env.SHOP_NAME,
    accessToken: process.env.ACCESS_TOKEN
  });
  shopify.order
    .list()
    .then((orders) => orders.forEach(saveShopifyOrder))
    .catch((err) => console.log(err));
}

async function saveShopifyOrder(orderJson) {
  const order = await updateOrInitializeOrder(orderJson);

  try  {
    const result = await order.save();
    console.log(result);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log("Error saving Order!", ex.errors[field].message);
    }
  }
}

async function updateOrInitializeOrder(orderJson) {
  const json = JSON.stringify(orderJson);
  let order = await Order.query().insertAndFetch({
    name: orderJson['name'],
    number: orderJson['number'],
    json: json
  });

  console.log(order);

  return order;
}

router.get("/orders", async (req, res) => {
  const orders = await Order.query()
  res.json(orders)
})
router.get('/pull_shopify_orders', async (req, res) => {
  await getShopifyOrders();
  res.send('Shopify Orders Pulled!');
})
app.use('/', router);
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});
// XXXXXXXXXXXXXXXXXXX

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));
