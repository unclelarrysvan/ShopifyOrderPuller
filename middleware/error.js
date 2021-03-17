module.exports = app.use(function(error, request, response, next) {
  response.status(500).send('Something happened...');
});
