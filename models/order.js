// const { Sequelize, Op, Model, DataTypes } = require("sequelize")
// 
// const sequelize = new Sequelize(process.env.DATABASE_URL)
// 
// const Order = sequelize.define('Order', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   number: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   json: {
//     type: DataTypes.JSON,
//     allowNull: false
//   }
// }, {
//   // Other model options go here
// });
// 
// Order.sync(); // Create table in DB if none exists
// 
// module.exports = Order;
