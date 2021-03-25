const Order = require('../models/order.js');
const XML = require('xml');
const dateFormat = require('dateformat');

async function formatOrders(params) {
  // TODO: take params into account for query
  const orders = await Order.query();
  let formattedOrders = orders.map((order) => formatOrder(order));

  return XML([{ Orders: formattedOrders }]);
}

function formatOrder(order) {
  // const order = await Order.query().findOne({ number: order_number });
  orderJson = JSON.parse(order.json);
  return {
    Order: [
      { OrderNumber: order.number },
      { OrderDate: formatDate(orderJson['processed_at']) },
      { OrderStatus: 'awaiting_shipment' }, // TODO: map this to shopify fulfillment status
      { LastModified: formatDate(orderJson['updated_at']) },
      // { ShippingMethod: orderJson[] },
      { PaymentMethod: '' },
      { CurrencyCode: orderJson['currency'] },
      { OrderTotal: orderJson['currency'] },
      { TaxAmount: '' },
      { ShippingAmount: '' },
      { CustomerNotes: '' },
      { InternalNotes: '' },
      { Gift: '' },
      { GiftMessage: '' },
      { Source: 'Shopify' },
      { Source: 'Shopify' },
      { Customer: customerInfo(orderJson) },

      // orderKey: order.orderKey TODO
      // { PaymentDate: formatDate(orderJson['processed_at']) },
      // { CustomerEmail: orderJson['email'] },
      // { Items: orderItemsFromJson(orderJson['line_items']) },
      // { AmountPaid: '' },
      // { RequestedShippingService: '' },
      // { CarrierCode: '' },
      // { ServiceCode: '' },
      // { PackageCode: '' },
      // { Confirmation: '' },
      // { Weight: {} },
      // { Dimensions: {} },
    ]
  };
}

function customerInfo(json) {
  return [
    { CustomerCode: customerCode(json) },
    { BillTo: billingAddress(json['billing_address'], json['email']) },
    { ShipTo: shippingAddress(json['shipping_address']) },
  ]
}

function customerCode(json) {
  return(json.hasOwnProperty('customer') ? json['customer']['id'] : json['email']);
}

function billingAddress(json, email) {
  if (json === undefined) { return []; }

  return [
    { Name:       json['name'] },
    { Company:    json['company'] },
    { Phone:      json['phone'] },
    { Email:      email }
  ];
}

function shippingAddress(json) {
  if (json === undefined) { return []; }

  return [
    { Name:       json['name'] },
    { Company:    json['company'] },
    { Address1:    json['address1'] },
    { Address2:    json['address2'] },
    { City:       json['city'] },
    { State:      json['province'] },
    { PostalCode: json['zip'] },
    { Country:    json['country_code'] },
    { Phone:      json['phone'] },
  ];
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
      { LineItemID: itemJson['id'] },
      { Sku: itemJson['sku'] },
      { Name: itemJson['title'] },
      // { ImageUrl: itemJson['id'] },
      { Weight: itemJson['grams'] },
      { WeightUnits: 'grams' }, // TODO: is this configurable or universal in shopify?
      { Quantity: itemJson['quantity'] },
      { UnitPrice: itemJson['price'] },
      // { Location: itemJson['price'] },
      { Adjustment: false }, // TODO: Do we want to use this or just leave false?
      { Options: [] }, // TODO needed?


      // { taxAmount: itemJson['id'] }, // TODO
      // { shippingAmount: itemJson['id' }, // TODO needed?
      // { warehouseLocation: itemJson['id' }, // TODO needed?
      // { ProductId: itemJson['product_id'] },
      // { fulfillmentSku: itemJson['id' }, // TODO needed?
      // { adjustment: itemJson['id' }, // TODO needed?
      // { upc: itemJson['id' }, // TODO needed?
    ]
  };
}

function formatDate(date) {
  return dateFormat(date, "dd/mm/yyyy HH:MM");
}

module.exports = formatOrders;
