const error    = require('./middleware/error');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroSequelize = require('@admin-bro/sequelize');
const express  = require('express');
const helmet  = require('helmet');
const bodyParser = require('body-parser');
const Order = require('./models/order');
const User = require('./models/user');
const routes = require('./routes');

AdminBro.registerAdapter(AdminBroSequelize);

const app = express();

const resourceParent = {
  name: 'Resources',
  icon: 'Model',
}

const adminBro = new AdminBro ({
  resources: [
    { resource: Order, options: { parent: resourceParent } },
    {
      resource: User,
      options:  {
        parent: resourceParent
      },
      properties: {
        encrypted_password: {
          isVisible: false
        },
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false
          }
        }
      },
      actions: {
        new: {
          before: async (request) => {
            if(request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          }
        }
      }
    }
  ],
  rootPath: '/admin',
})
// const router = AdminBroExpress.buildRouter (adminBro)
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      return user;
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})
app.use(helmet());
app.use(adminBro.options.rootPath, router);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use('/', routes);
<<<<<<< HEAD

// Error catching
app.use(error);
app.listen(port, () => console.log(`Listening on port ${port}...`));
=======
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});
app.listen(8080, () => console.log('AdminBro is under localhost:8080/admin'));
>>>>>>> origin/adminbro
