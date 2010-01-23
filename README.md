JSGI 0.3 Adapter for Node

To use, provide a JSGI application (can be application stack) to the start 
function:

    require("jsgi-node").start(function(request){
      var requestBody = request.input.read();
      return {
        status:200,
        headers:{},
        body:["echo: " + requestBody]
      };
    });

This adapter should conform to the JSGI 0.3 (with promises) for full 
asynchronous support. For example:

    var posix = require("posix");
    require("jsgi-node").start(function(request){
      var promise = new process.Promise();
      posix.cat("jsgi-node.js").addCallback(function(body){
        promise.emitSuccess({
	       status: 200,
		   headers: {},
		   body: [body]
	   });
      });
      return promise;
    });

Hopefully, the Node API will eventually be standardized through CommonJS as the HTTP Event Interface, at which point it would make sense to rename this to hei-jsgi or something like that, to use a standard adapter for any server that implements the API.

# Example implementations

`example.js` shows a simple JSGI application stack, that uses a Common Logger and URL routing middleware components. `node example.js` and then visit http://localhost:3000/test

# Acknowledgements

The `access-logger.js` is a quick port of [Jack](http://jackjs.org) [Common Logger](http://github.com/tlrobinson/jack/blob/master/lib/jack/commonlogger.js) from JSGI 0.2 to the 0.3 style.
The `routing.js` component is a port of [Express](http://github.com/visionmedia/express)'s Sinatra-style routing component.
Run the access logger and routing tests using `node tests.js`, which make use of the excellent [JSpec](http://visionmedia.github.com/jspec)
