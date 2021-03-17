const express = require ('express');
const router  = express.Router();

router.get('/', (request, response) => {
  // response.send('Hello World!');
  response.render('index', { title: 'Shopify Order Puller', message: 'Hello' });
});

module.exports = router;
