const Shopify = require('shopify-api-node');
const Order = require('../models/order.js');

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
  var order = await Order.findOne({ name: orderJson['name'] }).exec()
  const json = JSON.stringify(orderJson);

  if (order === null) {
    order = new Order({
      name: orderJson['name'],
      order_number: orderJson['number'],
      json: json
    });
  } else {
    if (order.json !== json) { 
      order.json = json;
    }
  }

  return order;
}

module.exports = getShopifyOrders;
