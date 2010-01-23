Router = function(defaultRoute) {
    
    this.routes = [defaultRoute];

    this.clearRoutes = function() {
      this.routes = [defaultRoute];
    };
    
    this.route = function(request) {
      var route = this.routeFor(request);
      if (route) {
        request.env.route = route;
        return route.run(request);
      } else {
        return { 
          status: 500, 
          body: ["Server Error: no route, not even the 404 route."], 
          headers: {} 
        };
      }
    };
    
    this.routeFor = function(request) {
      var matchingRoute;
      this.routes.some(function(route) {
        if (route.matches(request)) {
          matchingRoute = route;
          return true;
        }
      });
      return matchingRoute;
    };
};

Route = function( method, path, fn ) {
    this.method = method;
    this.originalPath = path;
    this.path = normalise(path);
    this.fn = fn;
    
    this.run = function(request) {
      return this.fn(request);
    };
    
    this.matches = function(request) {
      if (request.method.toLowerCase() == this.method) {
        request.env.captures = request.pathInfo.match(this.path);
        if (request.env.captures) {
          mapParams(request);
          return true;
        }
      }
      return false;
    };

  
    /**
     * Normalize _path_. When a RegExp it is simply returned,
     * otherwise a string is converted to a regular expression
     * surrounded by ^$. So /user/:id/edit would become:
     *
     * /^\/user\/([^\/]+)\/edit$/i
     *
     * Each param key (:id) will be captured and placed in the
     * params array, so param('id') would give the string captured.
     *
     * The following are valid routes:
     *
     *  - /user/:id         Ex: '/user/12'
     *  - /user/:id?        Ex: '/user', '/user/12'
     *  - /report.:format   Ex: '/report.pdf', 'report.csv'
     *
     * @param  {string} path
     * @return {regexp}
     * @api private
     */

    function normalise(path) {
      var self = this;
      this.keys = [];
      if (path instanceof RegExp) return path;
      
      return new RegExp('^' + path.replace(/[\s\/]*$/g, '')
        .replace(/\/:(\w+)\?/g, function(_, key){
          self.keys.push(key)
          return '(?:\/([^\/]+))?'
        })
        .replace(/:(\w+)/g, function(_, key){
          self.keys.push(key)
          return '([^\/]+)'
        }) + '$', 'i');
    };
    
    function mapParams(request) {
      var self = this;
      if (request.queryString) {
        request.env.params = require('querystring').parse(request.queryString);
      } else {
        request.env.params = {};
      }
      self.keys.forEach(function(key, i) {
        request.env.params[key] = request.env.captures[i+1];
      });
    };

};

function addRoute(method) {
  return function(path, fn) {
    router.routes.unshift(new Route(method, path, fn));
  };
};

var notFoundRoute = new Route('ALL_METHODS', 'ALL_PATHS', function(request) {
  return {
    status: 404,
    body: [ 'Not Found' ],
    headers: {}
  };
});
notFoundRoute.matches = function (request) { return true; }
var router = new Router(notFoundRoute);


exports.router = router;
exports.route = function (request) {
    return router.route(request);
};

exports.get  = addRoute('get');
exports.post = addRoute('post');
exports.del  = addRoute('delete');
exports.put  = addRoute('put');
