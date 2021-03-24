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

  try  {
    const result = await updateOrInitializeOrder(orderJson);
    console.log(result);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log("Error saving Order!", ex.errors[field].message);
    }
  }
}

async function updateOrInitializeOrder(orderJson) {
  const existingOrder = await Order.query().findOne({ name: orderJson['name'] })
  const json = JSON.stringify(orderJson);

  if (existingOrder == null) {
    return newOrder = await Order.query().insert({
      name: orderJson['name'],
      number: orderJson['number'],
      json: json
    });
  } else {
    return existingOrder;
  }
}

module.exports = getShopifyOrders;
