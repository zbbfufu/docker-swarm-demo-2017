(function() {
  'use strict';

  const hostname    = require("os").hostname(),
        assert      = require('assert'),
        http        = require('http'),
        port        = 3000;

  http.createServer((request, response) => {

    if( request.url === '/favicon.ico' ) {
      response.writeHead( 404 );
      response.end();
      return
    }

    console.log( "Front: got request " + request.url );

    http.get('http://back:9000/front/' + hostname, function( res ) {

      //res.setEncoding( 'utf8' );
      let rawData = '';
      res.on('data', chunk => { rawData += chunk; });
      res.on('end', function() {
        response.setHeader('Content-Type', 'application/json');
        response.end( JSON.stringify( JSON.parse( rawData ) ) + '\n');
      });
    });
  }).listen(port);

  console.log('Server running at http://' + hostname + ':' + port + '/');
})();
