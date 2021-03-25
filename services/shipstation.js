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
      { OrderNumber: order.number },
      // orderKey: order.orderKey TODO
      { OrderDate: orderJson['processed_at'] },
      { PaymentDate: orderJson['processed_at'] },
      { OrderStatus: 'awaiting_shipment' }, // TODO: map this to shopify fulfillment status
      { CustomerEmail: orderJson['email'] },
      { BillTo: addressFromJson(orderJson['billing_address']) },
      { ShipTo: addressFromJson(orderJson['shipping_address']) },
      { Items: orderItemsFromJson(orderJson['line_items']) },
      { AmountPaid: '' },
      { TaxAmount: '' },
      { ShippingAmount: '' },
      { CustomerNotes: '' },
      { InternalNotes: '' },
      { Gift: '' },
      { GiftMessage: '' },
      { PaymentMethod: '' },
      { PaymentMethod: '' },
      { RequestedShippingService: '' },
      { CarrierCode: '' },
      { ServiceCode: '' },
      { PackageCode: '' },
      { Confirmation: '' },
      { Weight: {} },
      { Dimensions: {} },
    ]
  };
}

function addressFromJson(json) {
  if (json === undefined) { return []; }

  return [
    { Name:       json['name'] },
    { Company:    json['company'] },
    { Street1:    json['address1'] },
    { Street2:    json['address2'] },
    // { street3: json['street3'] },
    { City:       json['city'] },
    { State:      json['province'] },
    { PostalCode: json['zip'] },
    { Country:    json['country_code'] },
    { Phone:      json['phone'] },
    // { residential: json['residential'] },
    // { addressVerified: json['addressVerified'] },
  ];
}

function orderItemsFromJson(itemsJson) {
  return itemsJson.map((itemJson) => orderItemFromJson(itemJson));
}

function orderItemFromJson(itemJson) {
  return {
    Item: [
      { LineItemKey: itemJson['id'] },
      { Sku: itemJson['sku'] },
      { Name: itemJson['title'] },
      // { imageUrl: itemJson['id'] },
      { Weight: itemJson['grams'] },
      { Quantity: itemJson['quantity'] },
      { UnitPrice: itemJson['price'] },
      // { taxAmount: itemJson['id'] }, // TODO
      // { shippingAmount: itemJson['id' },, // TODO needed?
      // { warehouseLocation: itemJson['id' },, // TODO needed?
      // { options: itemJson['id' },, // TODO needed?
      { ProductId: itemJson['product_id'] },
      // { fulfillmentSku: itemJson['id' },, // TODO needed?
      // { adjustment: itemJson['id' },, // TODO needed?
      // { upc: itemJson['id' },, // TODO needed?
    ]
  };
}

module.exports = formatOrders;
