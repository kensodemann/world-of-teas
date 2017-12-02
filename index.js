let app = require('./server/application');

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
