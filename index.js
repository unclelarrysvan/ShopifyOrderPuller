if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const express  = require('express');

const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose')

const helmet  = require('helmet');
const bodyParser = require('body-parser');
const Order = require('./models/order');
const User = require('./models/user');
const routes = require('./routes');

AdminBro.registerAdapter(AdminBroMongoose)

const app = express();

const mongodb = mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDb!'))
  .catch(error => console.log('Could not connect to MongoDb!', error.message));

const resourceParent = {
  name: 'Resources',
  icon: 'Model',
}

const adminBro = new AdminBro ({
  resources: [
    { resource: Order, options: { parent: resourceParent } },
    { resource: User, options: { parent: resourceParent } },
  ]
});

//const adminBro = new AdminBro ({
//  resources: [
//    // { resource: Order, options: { parent: resourceParent } },
//    {
//      resource: User,
//      options:  {
//        parent: resourceParent
//      },
//      properties: {
//        encrypted_password: { isVisible: false },
//        password: {
//          type: 'string',
//          isVisible: {
//            list: false, edit: true, filter: false, show: false
//          }
//        }
//      },
//      actions: {
//        new: {
//          before: async (request) => {
//            if(request.payload.password) {
//              request.payload = {
//                ...request.payload,
//                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
//                password: undefined,
//              }
//            }
//            return request
//          }
//        }
//      }
//    }
//  ],
//  rootPath: '/admin',
//})

const router = AdminBroExpress.buildRouter(adminBro);
// app.use(helmet());
app.use(adminBro.options.rootPath, router);
// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
app.use('/', routes);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));

// Error catching
//app.use(error);
// app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));
// app.listen(process.env.PORT, () => console.log('AdminBro is under /admin'));

// const run = async () => {
//   mongoose.connect('mongodb://localhost:27017/shopify_test', { useNewUrlParser: true })
//     .then(() => console.log('Connected to MongoDb!'))
//     .catch(error => console.log('Could not connect to MongoDb!', error.message));
//   await app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));
// }
// 
// run()
//
// const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
//   authenticate: async (email, password) => {
//     const user = await User.findOne({ email })
//     if (user) {
//       return user;
//       const matched = await bcrypt.compare(password, user.encryptedPassword)
//       if (matched) {
//         return user
//       }
//     }
//     return false
//   },
//   cookiePassword: 'some-secret-password-used-to-secure-cookie',
// })
