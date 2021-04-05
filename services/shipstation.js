const Order = require('../models/order.js');
const Dropshipper = require('../models/dropshipper.js');
const XML = require('xml');
const dateFormat = require('dateformat');
const OrderDetails = require('./order_details.js');

async function formatOrdersForVendor(params) {
  // TODO: Can filter orders by store eventually
  // TODO: Should we ping Shopify here and save the orders on the fly or have a separate job to pull orders?
  const orders = await Order.query().whereBetween('created_at', [params['start_date'], params['end_date']]);
  const dropshipper = await Dropshipper.query().findById(params['id']);

  const formattedOrders = [];
  for (order of orders) {
    if (orderContainsVendorItems(order, dropshipper.shopify_vendor)) {
      formattedOrders.push(formatOrderByVendor(order, dropshipper.shopify_vendor));
    } else {
      continue
    }
  }
  // TODO: Page orders
  formattedOrders.unshift({ _attr: { pages: 1 } });

  return XML([{ Orders: formattedOrders }], { declaration: true });
}

function orderContainsVendorItems(order, vendor) {
  return order.itemsForVendor(vendor).length > 0;
}

function formatOrderByVendor(order, vendor) {
  orderJson = JSON.parse(order.json);
  if (orderJson['shipping_address'] === undefined) { return {}; }

  return {
    Order: [
      { OrderID: { _cdata: orderJson['id'] } },
      { OrderNumber: { _cdata: order.number } },
      { OrderDate: formatDate(orderJson['processed_at']) },
      { OrderStatus: { _cdata: orderJson['financial_status'] } }, // TODO: map this to shopify fulfillment status
      { LastModified: formatDate(orderJson['updated_at']) },
      // { ShippingMethod: { _cdata: orderJson[] } },
      // { PaymentMethod: { _cdata: '' } },
      // { CurrencyCode: orderJson['currency'] },
      { OrderTotal: OrderDetails.totalForVendor(orderJson, vendor) },
      { TaxAmount: orderJson['total_tax'] },
      { ShippingAmount: totalShipping(orderJson) },
      // { CustomerNotes: { _cdata: '' } },
      // { InternalNotes: { _cdata: '' } },
      // { Gift: '' },
      // { GiftMessage: '' },
      { Source: 'Shopify' },
      { Customer: customerInfo(orderJson) },
      { Items: orderItemsFromJson(order.itemsForVendor(vendor)) },
    ]
  };
}

function customerInfo(json) {
  return [
    { CustomerCode: { _cdata: customerCode(json) } },
    { BillTo: billingAddress(json['billing_address'], json['email']) },
    { ShipTo: shippingAddress(json['shipping_address']) },
  ]
}

function customerCode(json) {
  return(json.hasOwnProperty('customer') ? json['customer']['id'] : json['email']);
}

function billingAddress(json, email) {
  return [
    { Name:       { _cdata: 'Stephen Crespo' } },//json['name'] },
    { Company:    { _cdata: '' } },//json['company'] },
    { Phone:      { _cdata: '8569047943' } },//json['phone'] },
    { Email:      { _cdata: email } }
  ];
}

function shippingAddress(json) {
  return [
    { Name:       { _cdata: json['name'] } },
    { Company:    { _cdata: json['company'] } },
    { Address1:    { _cdata: json['address1'] } },
    { Address2:    { _cdata: json['address2'] } },
    { City:       { _cdata: json['city'] } },
    { State:      { _cdata: json['province'] } },
    { PostalCode: { _cdata: json['zip'] } },
    { Country:    { _cdata: json['country_code'] } },
    { Phone:      { _cdata: json['phone'] } },
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
      { LineItemID: { _cdata: itemJson['id'] } },
      { SKU: { _cdata: itemJson['sku'] } },
      { Name: { _cdata: itemJson['title'] } },
      // { ImageUrl: { _cdata: itemJson['id'] } },
      { Weight: itemJson['grams'] },
      { WeightUnits: 'grams' }, // TODO: is this configurable or universal in shopify?
      { Quantity: itemJson['quantity'] },
      { UnitPrice: itemJson['price'] },
      // { Location: { _cdata: itemJson['price'] } },
      { Adjustment: false }, // TODO: Do we want to use this or just leave false?
      // { Options: [] },


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

function totalShipping(json) {
  return json['shipping_lines'].reduce(function(accumulator, currentValue) {
    return accumulator + parseFloat(currentValue['price'])
  }, 0);
}

function formatDate(date) {
  return dateFormat(date, "mm/dd/yyyy HH:MM");
}

module.exports = {
  //formatOrders: formatOrders,
  formatOrdersForVendor
};
