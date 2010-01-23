Request = function(method, path, query) {
  params = query ? require('querystring').parse(query) : {};
  this.method = method;
  this.scriptName = '';
  this.pathInfo = path;
  this.queryString = query;
  this.env = { params:  params };
  
  this.headers = {};
  this.version = [ 1, 1 ];
  this.remoteAddr = 'host';
  this.remoteUser = 'username';
};

function mockRequest(method) {
  return function(path, query) {
    return router.route(new Request(method, path, query));
  }
};

exports.Request = Request;
exports.GET = mockRequest('GET');
exports.POST = mockRequest('POST');
exports.PUT = mockRequest('PUT');
exports.DELETE = mockRequest('DELETE');
