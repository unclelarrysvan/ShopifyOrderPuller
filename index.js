if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express  = require('express');
// const helmet  = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});
app.use('/', routes);
app.use(bodyParser.json());
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));
