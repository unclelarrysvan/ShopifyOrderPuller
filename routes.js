const express  = require ('express');
const router  = express.Router();
const Order = require('./models/order.js');
const pullShopifyOrders = require('./services/shopify_order_puller.js');

router.get("/orders", async (req, res) => {
  const orders = await Order.find()
  res.json(orders)
})

router.get('/pull_shopify_orders', async (req, res) => {
  await pullShopifyOrders();
  res.send('Shopify Orders Pulled!');
})

module.exports = router;
