var 
  sys = require('sys'), 
  jsgiNode = require('jsgi-node');

var accessLogger;
try {
  var log4js = require('log4js-node');
  accessLogger = log4js.getLogger('jsgi.access');
} catch (e) {
  //can't find log4js-node, so make a fake logger
  accessLogger = {
    info: function(message) {
      sys.puts(message);
    }
  }
}

exports.jsgiLogger = function(jsgiApp, logger) {
  logger = logger || accessLogger;
  
  function logMessage(request, response) {
    var now = new Date(),
        address = request.headers['x-forwarded-for'] || request.remoteAddr || "-",
        user = request.remoteUser || "-",
        timestamp = format(now),
        method = request.method,
        path = (request.scriptName||"") + (request.pathInfo||""),
        query = request.queryString ? "?"+request.queryString : "",
        version = 'HTTP/'+request.version[0]+'.'+request.version[1],
        status = response.status,
        size = response.headers['Content-Length'] || '-';
    
    var message = address+' - '+user+' ['+timestamp+'] "'+method+' '+path+query+' '+version+'" '+status+' '+size;
    logger.info(message);
  }
  
  MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  function format(date) {
    var d = date.getDate(),
        m = MONTHS[date.getMonth()],
        y = date.getFullYear(),
        h = date.getHours(),
        mi = date.getMinutes(),
        s = date.getSeconds();
        
    return (d<10?"0":"")+d+"/"+m+"/"+y+" "+
        (h<10?"0":"")+h+":"+(mi<10?"0":"")+mi+":"+(s<10?"0":"")+s;
  }

  return function(request) {
    var response = jsgiApp(request);
    if (typeof response.then === "function") {
      
      response.then(
        function(resp) {
          logMessage(request, resp);
        }, 
        function(err) {
          logMessage(request, {status: 500, headers: {}, body: []});
        }
      );
    } else {
      logMessage(request, response);
    }
      
    return response;
  }
};

