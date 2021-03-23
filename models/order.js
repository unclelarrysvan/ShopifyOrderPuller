const { Sequelize, Op, Model, DataTypes } = require("sequelize")

const sequelize = new Sequelize('postgres://me:password@localhost:5432/shopifytest')

const Order = sequelize.define('Order', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
<<<<<<< HEAD
    type: String,
    required: true
=======
    type: DataTypes.STRING,
    allowNull: false
>>>>>>> origin/adminbro
  },
  json: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  // Other model options go here
});

Order.sync(); // Create table in DB if none exists

module.exports = Order;
