process.mixin(GLOBAL, require('mock-request'), require('routing'))


describe 'routing'
  before_each
    router.clearRoutes();
  end
  
  describe 'route'
    it 'should return the matching route'
      get('/pants', function(request) {
        return "pants";
      });
      get('/nonsense', function(request) {
        return "not pants";
      });
      
      GET('/pants').should.be 'pants'
      GET('/nonsense').should.be 'not pants'
      POST('/pants').status.should.be 404
    end
    
    it 'should pass parameters from the route'
      get('/:things/:colour', function(request) {
        return request.env.params['things']+" are "+request.env.params['colour'];
      });
      
      GET('/pants/blue').should.be 'pants are blue'
    end
    
    it 'should include the route in the request env'
      get('/stuff', function(request) {
        return request.env.route
      });
      
      GET('/stuff').should.not.be undefined
      GET('/stuff').originalPath.should.be '/stuff'
    end
  end
  
  describe 'with a placeholder'
    it 'should still match'
      get('/user/:id', function(){ return 'yay' })
      GET('/user/12').should.eql 'yay'
    end
    
    it 'should not match with an additional path segment'
      get('/user/:id', function(){ return 'yay' })
      GET('/user/12/edit').status.should.eql 404
      GET('/user/12/edit').body[0].should.eql 'Not Found'
    end
    
    it 'should pass it to the route function in the param object'
      get('/user/:id', function(request){
        return request.env.params['id']
      })
      GET('/user/12').should.eql '12'
    end
  end
      
  describe 'with several placeholders'
    it 'should still match'
      get('/user/:id/:op', function(){ return 'yay' })
      GET('/user/12/edit').should.eql 'yay'
    end
    
    it 'should pass them to the route function in the param object'
      get('/user/:id/:op', function(request){
        return request.env.params['op'] + 'ing user ' + request.env.params['id']
      })
      GET('/user/12/edit').should.eql 'editing user 12'
    end
  end
  
  describe 'with an optional placeholder'
    it 'should match with a value'
      get('/user/:id?', function(){ return 'yay' })
      GET('/user/1').should.eql 'yay'
    end
    
    it 'should pass it to the route function'
      get('/user/:id?', function(request){
        return request.env.params['id'] || 'You'
      })
      GET('/user/12').should.eql '12'
      GET('/user').should.eql 'You'
    end
    
    it 'should match without a value'
      get('/user/:id?', function(){ return 'yay' })
      GET('/user').should.eql 'yay'
    end
    
    it 'should not match with an additional path segment'
      get('/user/:id?', function(){ return 'yay' })
      GET('/user/12/edit').body[0].should.eql 'Not Found'
      GET('/user/12/edit').status.should.eql 404
    end
  end
  
  describe 'with partial placeholder'
    it 'should still match'
      get('/report.:format', function(){
        return 'yay'
      })
      GET('/report.csv').should.eql 'yay'
      GET('/report.pdf').should.eql 'yay'
    end
    
    it 'should not match without value'
      get('/report.:format', function(){
        return 'yay'
      })
      GET('/report.').body[0].should.eql 'Not Found'
      GET('/report.').status.should.eql 404
    end
  end
  
  describe 'with an unmatchable request path'
    it 'should respond with 404 Not Found'
      GET('/something').status.should.eql 404
      GET('/something').body[0].should.eql 'Not Found'
    end
  end
  
  
  describe 'dsl'
    it 'should provide a get function'
      get('/path', function(request) {
        return "tester";
      });
      
      router.routes.length.should.be 2
      router.routes[0].method.should.be 'get'
      router.routes[0].originalPath.should.be '/path'
      router.routes[0].fn().should.eql 'tester'
    end
    
    it 'should provide a post function'
      post('/pants', function(request) {
        return 'another';
      });
      router.routes.length.should.be 2
      router.routes[0].method.should.be 'post'
      router.routes[0].originalPath.should.be '/pants'
      router.routes[0].fn().should.eql 'another'
    end
    
    it 'should provide a put function'
      put('/pants', function(request) {
        return 'another';
      });
      router.routes.length.should.be 2
      router.routes[0].method.should.be 'put'
      router.routes[0].originalPath.should.be '/pants'
      router.routes[0].fn().should.eql 'another'
    end
    
    it 'should provide a del function'
      del('/pants', function(request) {
        return 'another';
      });
      router.routes.length.should.be 2
      router.routes[0].method.should.be 'delete'
      router.routes[0].originalPath.should.be '/pants'
      router.routes[0].fn().should.eql 'another'
    end
  end
end
