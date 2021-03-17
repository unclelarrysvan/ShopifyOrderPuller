const express  = require ('express');
const mongoose = require('mongoose');
const routes   = require('./routes');
const error    = require('./middleware/error');

// Connect to DB
// TODO: Make DB name customizable
mongoose.connect('mongodb://localhost/shopify-order-puller-test')
  .then(() => console.log('Connected to MongoDb!'))
  .catch(error => console.log('Could not connect to MongoDb!', error.message));

// Setup routes and server
const app = express();
const port = process.env.PORT || 3001;

app.use('/', routes);

// Error catching
app.use(error);
app.listen(port, () => console.log(`Listening on port ${port}...`));
