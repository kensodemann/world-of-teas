let app = require('./server/application');

require('./server/api-routes')(app);

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
