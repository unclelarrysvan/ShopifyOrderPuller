const express           = require('express');
const router            = express.Router();
const Order             = require('./models/order.js');
const Dropshipper       = require('./models/dropshipper.js');
const pullShopifyOrders = require('./services/shopify_order_puller.js');
const createFulfillment = require('./services/shopify_fulfillment_creator.js');
//const { formatOrders, formatOrdersForVendor } = require('./services/shipstation.js');
const { formatOrdersForVendor } = require('./services/shipstation.js');
// const asyncMiddleware   = require('./middleware/async');
const bodyParser        = require('body-parser');
require('body-parser-xml')(bodyParser);

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
});

router.get('/pull_shopify_orders', async (req, res) => {
  await pullShopifyOrders();
  res.send('Shopify Orders Pulled!');
});

router.get("/dropshippers", async (req, res) => {
  const orders = await Dropshipper.query();
  res.json(orders);
});

router.post("/dropshippers", bodyParser.json(), async (req, res) => {
  const dropshipper = await Dropshipper.query().insert({
    name: req.body.name,
    shopify_vendor: req.body.shopify_vendor
  });
  res.json(dropshipper);
});

router.get('/shipstation', async (req, res) => {
  const xml = await formatOrders(req);
  res.type('text/xml');
  res.send(xml);
});

// router.post('/shipstation', async (req, res) => {
//   const xml = await formatOrders(req);
//   res.type('text/xml');
//   res.send(xml);
// });


router.get('/dropshippers/:id/shipstation', async (req, res) => {
  const xml = await formatOrdersForVendor({ ...req.params, ...req.query });
  res.type('text/xml');
  res.send(xml);
});

router.post('/dropshippers/:id/shipstation', bodyParser.xml(), async (req, res) => {
  // Find Order
  // const order = await Order.query().findOne({ number: req.query['order_number'] });
  // create shopify fulfillment request for items in xml body
  createFulfillment(req.query['order_number'], req.body);

  // console.log(req.body);
  res.send('received');
});

module.exports = router;
