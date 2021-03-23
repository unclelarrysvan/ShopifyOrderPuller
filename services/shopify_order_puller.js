const Shopify = require('shopify-api-node');
const Order = require('../models/order.js');

async function getShopifyOrders() {
  const shopify = new Shopify({
      // shopName: process.env.SHOP_NAME,
      // accessToken: process.env.ACCESS_TOKEN
      shopName: 'crespo-test.myshopify.com',
      accessToken: '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'
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
  var order = await Order.findOne({ name: orderJson['name'] })
  const json = JSON.stringify(orderJson);

  if (order === null) {
    order = await Order.create({
      name: orderJson['name'],
      number: orderJson['number'],
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
