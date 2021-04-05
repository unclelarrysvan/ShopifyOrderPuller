module.exports = class OrderDetails {
  static itemPriceBeforeAdjustments(item) {
    return parseFloat(item['price']) * parseInt(item['quantity'])
  }

  static itemTaxLinesSum(item) {
    return item['tax_lines'].reduce(function(accumulator, taxLine) {
      return accumulator +  parseFloat(taxLine['price'])
    }, 0);
  }

  static itemDiscountedAmount(item) {
    return item['discount_allocations'].reduce(function(accumulator, discountLine) {
      return accumulator + parseFloat(discountLine['amount'])
    }, 0);
  }

  static itemShipping(orderJson) {
    return orderJson['shipping_lines'].reduce(function(accumulator, shippingLine) {
      return accumulator +  parseFloat(shippingLine['price'])
    }, 0) / lineItems(orderJson).length
  }

  static totalTax(orderJson) {
    return parseFloat(orderJson['total_tax'])
  }

  static lineItems(orderJson) {
    return orderJson['line_items']
  }

  static shippingTotal(orderJson) {
    return parseFloat(orderJson['total_shipping_price_set']['shop_money']['amount'])
  }

  static discountTotal(orderJson) {
    return parseFloat(orderJson['total_discounts'])
  }

  static itemsForVendor(orderJson, vendor) {
    return orderJson['line_items'].filter(function(item) {
      return item['vendor'].toUpperCase() == vendor.toUpperCase()
    })
  }

  static totalForVendor(orderJson, vendor) {
    let total = OrderDetails.itemsForVendor(orderJson, vendor).reduce(function(accumulator, item) {
      return accumulator
        + OrderDetails.itemPriceBeforeAdjustments(item)
    }, 0)
    total -= OrderDetails.totalDiscountByVendor(orderJson, vendor)
    total += OrderDetails.totalTaxByVendor(orderJson, vendor)
    total += OrderDetails.totalShippingByVendor(orderJson, vendor)
    return total
  }

  static totalDiscountByVendor(orderJson, vendor) {
    return OrderDetails.totalByVendor(OrderDetails.discountTotal(orderJson), orderJson, vendor)
  }

  static totalTaxByVendor(orderJson, vendor) {
    return OrderDetails.totalByVendor(OrderDetails.totalTax(orderJson), orderJson, vendor)
  }

  static totalShippingByVendor(orderJson, vendor) {
    return OrderDetails.totalByVendor(OrderDetails.shippingTotal(orderJson), orderJson, vendor)
  }

  // FIXME: Make a better name for this
  static totalByVendor(amount, orderJson, vendor) {
    return (
      amount
        / OrderDetails.lineItems(orderJson).length
        * OrderDetails.itemsForVendor(orderJson, vendor).length
    )
  }
}
