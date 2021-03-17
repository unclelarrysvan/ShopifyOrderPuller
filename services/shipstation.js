const Order = require('../models/order.js');

async function pushOrder(order_number) {
  const order = await Order.findOne({ number: order_number }).exec();
  const shipstation = {
    shopName: 'abc',
    accessToken: '123'
  };
  orderJson = JSON.parse(order.json);
  formattedOrder = {
    orderNumber: order.number,
    // orderKey: order.orderKey TODO
    orderDate: orderJson['processed_at'],
    // paymentDate: orderJson['processed_at'],
    orderStatus: 'awaiting_shipment', // TODO: map this to shopify fulfillment status
    customerEmail: orderJson['email'],
    billTo: addressFromJson(orderJson['billing_address']),
    shipTo: addressFromJson(orderJson['shipping_address']),
    items: orderItemFromJson(orderJson['line_items']),
    amountPaid: '',
    taxAmount: '',
    shippingAmount: '',
    customerNotes: '',
    internalNotes: '',
    gift: '',
    giftMessage: '',
    paymentMethod: '',
    paymentMethod: '',
    requestedShippingService: '',
    carrierCode: '',
    serviceCode: '',
    packageCode: '',
    confirmation: '',
    weight: {},
    dimensions: {},
  };
  return formattedOrder;
  // shipstation.pushOrder(formattedOrder);
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

module.exports = pushOrder;
