const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  name:   { type: String, required: true },
  number: { type: String, required: true },
  json:   { type: String, required: true }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
