const Order = require('../models/order.js');
const XML = require('xml');

async function formatOrders(params) {
  const orders = await Order.query();
  let order = formatOrder(orders[0]);
  let result = [{ Orders: [ order ] }];

  return XML(result);
}

function formatOrder(order) {
  // const order = await Order.query().findOne({ number: order_number });
  orderJson = JSON.parse(order.json);
  return {
    Order: [
      { orderNumber: order.number },
      // orderKey: order.orderKey TODO
      { orderDate: orderJson['processed_at'] },
      { paymentDate: orderJson['processed_at'] },
      { orderStatus: 'awaiting_shipment' }, // TODO: map this to shopify fulfillment status
      { customerEmail: orderJson['email'] },
      { billTo: addressFromJson(orderJson['billing_address']) },
      { shipTo: addressFromJson(orderJson['shipping_address']) },
      { items: orderItemFromJson(orderJson['line_items']) },
      { amountPaid: '' },
      { taxAmount: '' },
      { shippingAmount: '' },
      { customerNotes: '' },
      { internalNotes: '' },
      { gift: '' },
      { giftMessage: '' },
      { paymentMethod: '' },
      { paymentMethod: '' },
      { requestedShippingService: '' },
      { carrierCode: '' },
      { serviceCode: '' },
      { packageCode: '' },
      { confirmation: '' },
      { weight: {} },
      { dimensions: {} },
    ]
  };
}

function addressFromJson(json) {
  if (json === undefined) { return {}; }

  return {
    name:       json['name'],
    company:    json['company'],
    street1:    json['address1'],
    street2:    json['address2'],
    // street3: json['street3'],
    city:       json['city'],
    state:      json['province'],
    postalCode: json['zip'],
    country:    json['country_code'],
    phone:      json['phone'],
    // residential: json['residential'],
    // addressVerified: json['addressVerified'],
  };
}

function orderItemsFromJson(itemsJson) {
  itemsJson.map((itemJson) => { orderItemFromJson(itemJson); });
}

function orderItemFromJson(itemJson) {
  return {
    lineItemKey: itemJson['id'],
    sku: itemJson['sku'],
    name: itemJson['title'],
    // imageUrl: itemJson['id'],
    weight: itemJson['grams'],
    quantity: itemJson['quantity'],
    unitPrice: itemJson['price'],
    // taxAmount: itemJson['id'], // TODO
    // shippingAmount: itemJson['id'], // TODO needed?
    // warehouseLocation: itemJson['id'], // TODO needed?
    // options: itemJson['id'], // TODO needed?
    productId: itemJson['product_id'],
    // fulfillmentSku: itemJson['id'], // TODO needed?
    // adjustment: itemJson['id'], // TODO needed?
    // upc: itemJson['id'], // TODO needed?
  };
}

module.exports = formatOrders;
