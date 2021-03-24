// const bcrypt = require('bcrypt');
// const { Sequelize, Op, Model, DataTypes } = require("sequelize")
// 
// const sequelize = new Sequelize(process.env.DATABASE_URL)
// const saltRounds = 10
// 
// const User = sequelize.define('User', {
//   email: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//     unique: true,
//     isEmail: true
//   },
//   encryptedPassword: {
//     type: DataTypes.STRING(64),
//     allowNull: false,
//     is: /^[0-9a-f]{64}$/i,
//     set(value) {
//       const hash = bcrypt.hashSync(value, saltRounds)
//       this.setDataValue('encryptedPassword', hash);
//     }
//   },
//   name: {
//     type: DataTypes.STRING
//   },
//   role: {
//     type: DataTypes.STRING,
//     isIn: [['admin', 'restricted']],
//     allowNull: false
//   },
// }, {
//   // Other model options go here
// });
// 
// User.sync(); // Create table in DB if none exists
// //(async () => {
// //  await sequelize.sync({ force: true });
// //  // Code here
// //})()
// 
// module.exports = User;
