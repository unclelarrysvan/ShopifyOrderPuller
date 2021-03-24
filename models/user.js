// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const saltRounds = 10
// 
// //const User = mongoose.model('User', {
// //  email: {
// //    type: String,
// //    required: true,
// //    unique: true,
// //    isEmail: true
// //  },
// //  encryptedPassword: {
// //    type: String,
// //    required: true,
// //    is: /^[0-9a-f]{64}$/i,
// //    set(value) {
// //      const hash = bcrypt.hashSync(value, saltRounds)
// //      this.setDataValue('encryptedPassword', hash);
// //    }
// //  },
// //  name: {
// //    type: String,
// //  },
// //  role: {
// //    type: String,
// //    isIn: [['admin', 'restricted']],
// //    allowNull: false
// //  },
// //}, {
// //  timestamps: true
// //});
// 
// const userSchema = mongoose.Schema({
//   email: { type: String, required: true },
//   encryptedPassword: { type: String, required: true }
// }, {
//   timestamps: true
// });
// 
// const User = mongoose.model('User', userSchema);
// 
// module.exports = User;
