const Shopify = require('shopify-api-node');
const Order = require('../models/order.js');
const pry = require('pry');

async function createFulfillment(orderId, params) {
  // FIXME: This may be order id, not number
  // const order = Order.query().findOne({ number: orderId });
  const order = await Order.query().findOne('number', '3');

  const shopify = new Shopify({
    shopName: process.env.SHOP_NAME,
    apiKey: process.env.API_KEY,
    password: process.env.PASSWORD
  });
  // console.log(JSON.parse(order.json)['id']);
  console.log(params['ShipNotice']['Items'][0]['Item']);
  console.log(fulfillmentParams(order, params));

  // shopify.fulfillment
  //   .count(JSON.parse(order.json)['id'])
  //   //.list(JSON.parse(order.json)['id'])
  //   //.cancel(JSON.parse(order.json)['id'], '3285531132085')
  //   .then((response) => console.log(response))

  // TODO: check for existing fulfillment first
  shopify.fulfillment
    .create(JSON.parse(order.json)['id'], fulfillmentParams(order, params))
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
  // TODO: Save shipstation attempts
  // TODO: Do something useful with this error.
}

function fulfillmentParams(order, params) {
  return {
    location_id: JSON.parse(order.json)['location_id'],
    tracking_company: params['ShipNotice']['Carrier'][0],
    tracking_number: params['ShipNotice']['TrackingNumber'][0],
    line_items: lineItemParams(params)
  }
}

function lineItemParams(params) {
  // TODO: Do we anticipate individual items split shipping?
  return params['ShipNotice']['Items'].map(function(itemParams) {
    return { id: itemParams['Item'][0]['LineItemID'][0] }
  });
}

module.exports = createFulfillment;
