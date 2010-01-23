process.mixin(GLOBAL, require('mock-request'));
access = require('access-logger');

describe 'jsgiLogger'
  before_each
    logMessage = '';
    
    logger = {
      info: function(message) {
        logMessage = message;
      }
    };

    testResponse = { status: 200, headers: {}, body: ['Nothing'] };
    testApp = function(request) {
      return testResponse;
    }
  end
        
  it 'should log the response of a jsgi application'
    var jsgiLogger = access.jsgiLogger(testApp, logger);
    request = new Request('GET', '/cheese');
    var response = jsgiLogger(request);
    
    response.should.be testResponse
    var parts = logMessage.match(/^(.*?)\s\-\s(.*?)\s\[(.*?)\]\s\"(.*?)"\s(.*?)\s-/);
    parts[1].should.be 'host'
    parts[2].should.be 'username'
    //TODO: work out how to test that this part is a date
    //visual inspection says it is fine.
    //parts[3].should.be a_date_in(Date.ISO8601_FORMAT)
    parts[4].should.be 'GET /cheese HTTP/1.1'
    parts[5].should.eql '' + testResponse.status
  end
  
  it 'should log the response of a promise-returning jsgi application'
    testResponse = new process.Promise();
    var jsgiLogger = access.jsgiLogger(testApp, logger);
    request = new Request('GET', '/cheese?and=biscuits');
    var response = jsgiLogger(request);
    
    response.should.be testResponse
    
    testResponse.emitSuccess({ status: 200, headers: {}, body: ['Nothing']});
    
    var parts = logMessage.match(/^(.*?)\s\-\s(.*?)\s\[(.*?)\]\s\"(.*?)"\s(.*?)\s-/);
    parts[1].should.be 'host'
    parts[2].should.be 'username'
    //TODO: work out how to test that this part is a date
    //visual inspection says it is fine.
    //parts[3].should.be a_date_in(Date.ISO8601_FORMAT)
    parts[4].should.be 'GET /cheese?and=biscuits HTTP/1.1'
    parts[5].should.eql '200'
  end
end
