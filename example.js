require.paths.unshift('./lib');
var
  jsgi = require('jsgi-node'),
  routing = require('routing'),
  logging = require('access-logger');

routing.get('/test', function(request) {
  return {
    status: 200,
    headers: { 'Content-Type': 'text/plain'},
    body: ['Hello World']
  };
})

jsgi.start(
  logging.jsgiLogger(
    routing.route
  ),
  { port: 3000 }
);
