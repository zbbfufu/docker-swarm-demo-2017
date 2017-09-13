(function() {
  'use strict';

  const hostname    = require("os").hostname(),
        redis       = require('redis').createClient({host: 'redis', port: '6379'}),
        http        = require('http'),
        port        = 9000;

  redis.on('ready', function() {
    console.log("Redis is ready");
  });
  redis.on('error',function() {
    console.log("Error in Redis");
  });

  http.createServer((request, response) => {

    if( !request.url.startsWith('/front/') ) {
      response.writeHead( 404 );
      response.end();
      return;
    }

    const remote = request.url.split('/')[2];

    console.log( "Back: got request from " + remote );

    //increment current front+back pair
    redisIncr( remote );

    //get all existing keys
    redisDict()
      .then( map => {
        response.setHeader('Content-Type', 'application/json');
        response.end( JSON.stringify( map ) );
      })
      .catch(function(err){
        console.warn(err);
      });

  }).listen(port);

  console.log('Server running at ' + hostname + ':' + port + '/');

  function redisIncr( remote ){
    const currentKey = remote + '/' + hostname;
    redis.exists( currentKey, function(err, exists) {
      if( exists == false ) {
        redis.set( currentKey, 1 );

      } else {
        redis.incr( currentKey );
      }
    });
  }

  function redisDict( ) {
    return new Promise( (resolve, reject) => {
      redis.keys('*', function (err, keys) {
        return Promise.all(
          keys.map(function( key ){
            return new Promise(function(resolve,reject){
              redis.get( key, function(err, value) {
                if(err)  return reject(err);
                var obj = {};
                obj[key] = Number.parseInt( value );
                resolve( obj );
              });
            });
          })
        ).then( results => {
          var map = results.reduce( function(obj, item){
            return Object.assign( obj, item );
          },{});

          resolve( map );
        });
      });
    });
  }

})();
