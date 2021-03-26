const express           = require('express');
const router            = express.Router();
const Order             = require('./models/order.js');
const pullShopifyOrders = require('./services/shopify_order_puller.js');
const formatOrders      = require('./services/shipstation.js');
// const asyncMiddleware   = require('./middleware/async');

// router.get("/orders", asyncMiddleware(async (request, response) => {
//   const orders = await Order.find();
//   response.json(orders);
// }));
// 
// router.get('/pull_shopify_orders', asyncMiddleware(async (request, response) => {
//   await pullShopifyOrders();
//   response.send('Shopify Orders Pulled!');
// }));

// router.get('/push_shopify_order/:number', asyncMiddleware(async (request, response) => {
//   shipstation_response = await pushOrder(request.params['number']);
//   // shipstation_response = await shipstation.pushOrder(request.number);
//   // TODO: Add guard for failure
//   response.send(shipstation_response);
// }));

router.get("/orders", async (req, res) => {
  const orders = await Order.query()
  res.json(orders)
})

router.get('/pull_shopify_orders', async (req, res) => {
  await pullShopifyOrders();
  res.send('Shopify Orders Pulled!');
})

router.get('/shipstation', async (req, res) => {
  const xml = await formatOrders(req);
  res.type('text/xml');
  res.send(xml);
})

module.exports = router;
