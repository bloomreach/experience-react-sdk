/*
 * Copyright (c) 2013-2017
 * 
 * Woonsan Ko
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE
 */


/**
 *
 * Reverse Proxy Script using Node.js
 * ( https://github.com/woonsan/hippo7-rproxy-nodejs )
 *
 * Usage: `sudo node rproxy.js` will open 80 port.
 *        `node rproxy.js 8888` will open 8888 port.
 *        `node rproxy.js 8888 8443` will open 8888 port and 8443 ssl port.
 *
 */


/*============================================================*/
/* Reverse Proxy Server Default Options Configuration         */
/*------------------------------------------------------------*/

var defaultOptions = {
  xfwd: true, // add X-Forwarded-* headers
  secure: false // fixes errors about self signed certs
};

// SSL Key file paths; change those paths if you have those in other paths.
var ssl_private_key_path = './priv.pem';
var ssl_certificate_path = './cert.pem';

/*------------------------------------------------------------*/
/* URL Path Mappings Configuration for Reverse Proxy Targets  */
/*------------------------------------------------------------*/
// You can add edit mappings below!

var mappings = [
  {
    host: '*',
    pathregex: /^\/cms(\/|$)/,
    route: {
      target: 'http://localhost:8080'
    }
  },
  {
    host: '*',
    pathregex: /^\/site(\/_cmsinternal)?\/resourceapi/,
    route: {
      target: 'http://localhost:8080'
    }
  },
  {
    host: '*',
    pathregex: /^\/site\/binaries(\/|$)/,
    route: {
      target: 'http://localhost:8080'
    }
  },
  {
    host: '*',
    pathregex: /^\/site\/images(\/|$)/,
    route: {
      target: 'http://localhost:8080'
    }
  },
  {
    host: '*',
    pathregex: /^\/site\/_rp(\/|$)/,
    route: {
      target: 'http://localhost:8080'
    }
  },
  {
    host: '*',
    pathregex: /^\/site\/_targeting(\/|$)/,
    route: {
      target: 'http://localhost:8080'
    }
  },
  {
    host: '*',
    pathregex: /^\/site\/_cmsinternal\/binaries(\/|$)/,
    route: {
      target: 'http://localhost:8080'
    }
  },
  {
    host: '*',
    pathregex: /^\/site\/_cmsinternal(\/|$)/,
//     pathreplace: '/',
    route: {
      target: 'http://localhost:3000'
    }
  },
  {
    host: '*',
    pathregex: /^\/_next(\/|$)/,
    route: {
      target: 'http://localhost:3000'
    }
  },
  {
    host: '*',
    pathregex: /^\/static(\/|$)/,
    route: {
      target: 'http://localhost:3000'
    }
  },
];

/*------------------------------------------------------------*/
/* End of Configuration                                       */
/*============================================================*/


// Normally you don't need to look into the detail below
// in most cases unless you want to debug. :-)

var colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

/**************************************************************/
/* Internal Server Handling Code from here                    */
/*------------------------------------------------------------*/

// find out the port number command line argument
var port = 80;
if (process.argv[2]) {
  port = parseInt(process.argv[2]);
}

// build up the ssl options
var sslOptions = {};
var fs = require('fs');
if (fs.existsSync(ssl_private_key_path)) {
  sslOptions.key = fs.readFileSync(ssl_private_key_path, 'utf8');
} else {
  console.log(('SSL Disabled. SSL private key file does not exist: ' + ssl_private_key_path).warn);
}
if (fs.existsSync(ssl_certificate_path)) {
  sslOptions.cert = fs.readFileSync(ssl_certificate_path, 'utf8');
} else {
  console.log(('SSL Disabled. SSL certificate does not exist: ' + ssl_certificate_path).warn);
}

// let's start building proxy server from here

var http = require('http'),
    httpProxy = require('http-proxy');

//
// function to find a mapping by request path
//
var findMapping = function(req) {
  var host = req.headers['host'];
  for (var i in mappings) {
    var um = mappings[i];
    if (um.host && um.host != '*' && um.host != host) {
      continue;
    }
    if (um.pathregex && req.url.match(um.pathregex)) {
      return um;
    }
  }
  return null;
};

//
// Create a proxy server with custom application logic
//
var proxyServer = httpProxy.createProxyServer(defaultOptions);
proxyServer.on('error', function(error) {
  console.log('-',
              ('[' + new Date().toISOString() + ']').data,
              'ERROR'.warn,
              '-',
              '-'.data,
              ('[Gateway Error] ' + error).warn,
              ('503').error);
});
proxyServer.on('proxyReq', function(proxyReq, req, res, options) {
  var target = options.target;
  if (target) {
    if ((target.protocol == 'http' && target.port == '80') ||
        (target.protocol == 'https' && target.port == '443')) {
      proxyReq.setHeader('Host', target.hostname);
    } else {
      proxyReq.setHeader('Host', target.host);
    }
    target['targetHostHeaderValue'] = proxyReq.getHeader('Host');
    req.proxyAttrs['target'] = target;
  }
  if (req.proxyAttrs['proxyMapping'] && req.proxyAttrs['proxyMapping'].reqHeaders) {
    var headers = req.proxyAttrs['proxyMapping'].reqHeaders;
    for (var name in headers) {
      proxyReq.setHeader(name, headers[name]);
    }
  }
});
proxyServer.on('proxyRes', function(proxyRes, req, res, options) {
  //console.log('DEBUG'.debug, req);
  var location = proxyRes.headers['location'];
  var isHttps = /^https/.test(req.headers['x-forwarded-proto']);
  var scheme = isHttps ? 'https' : 'http';
  if (location && req.proxyAttrs['target']) {
    var target = req.proxyAttrs['target'];
    if (location.indexOf(target.href) == 0) {
      var sourceBase = scheme + '://' + req.headers['host'] + '/';
      location = sourceBase + location.substring(target.href.length);
      proxyRes.headers['location'] = location;
    }
  }

  var setCookieHeaders = proxyRes.headers['set-cookie'];
  if (setCookieHeaders && req.proxyAttrs['proxyMapping'] && req.proxyAttrs['proxyMapping'].setcookie) {
    var setcookie = req.proxyAttrs['proxyMapping'].setcookie;
    if (setcookie.pathregex && setcookie.pathreplace != null) {
      var newCookieHeaders = [];
      for (var i = 0; i < setCookieHeaders.length; i++) {
        var value = setCookieHeaders[i];
        if (/(^.+;\s+Path=)([^;]*)($|(;.*$))/i.test(value)) {
          var prefix = RegExp.$1;
          var path = RegExp.$2;
          var suffix = RegExp.$3;
          var newValue = prefix + path.replace(setcookie.pathregex, setcookie.pathreplace) + suffix;
          newCookieHeaders.push(newValue);
        } else {
          newCookieHeaders.push(value);
        }
      }
      proxyRes.headers['set-cookie'] = newCookieHeaders;
      //console.log('Converting set-cookie from "' + JSON.stringify(setCookieHeaders) + '" to "' + JSON.stringify(newCookieHeaders) + '".');
    }
  }

  console.log(scheme,
              ('[' + new Date().toISOString() + ']').data,
              req.method.info,
              req.proxyAttrs['requestUrl'],
              ('HTTP/' + proxyRes.httpVersion).data,
              (req.proxyAttrs['target'].href + req.proxyAttrs['targetRequestUrl'].substring(1)),
              proxyRes.statusCode < 400 ? ('' + proxyRes.statusCode).info : ('' + proxyRes.statusCode).error);
});

//
// proxy handler
//
var proxyHandler = function(req, res) {
  req.proxyAttrs = {};
  var mapping = findMapping(req);
  if (!mapping) {
    res.writeHead(404);
    res.end();
    console.log('WARN'.warn, 'Mapping not found for '.info, req.url.data);
  } else {
    req.proxyAttrs['proxyMapping'] = mapping;
    var oldReqUrl = req.url;
    req.proxyAttrs['requestUrl'] = oldReqUrl;
    if (mapping.pathreplace) {
      req.url = oldReqUrl.replace(mapping.pathregex, mapping.pathreplace);
    }
    req.proxyAttrs['targetRequestUrl'] = req.url;
    proxyServer.web(req, res, mapping.route);
  }
};
 
//
// Create your custom server and just call `proxy.web()` to proxy 
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
http.createServer(proxyHandler).listen(port);
console.log('');
console.log(('Reverse Proxy Server started at port ' + port + ' ...').info);

// start another server at ssl port if configured
if (sslOptions.key && sslOptions.cert) {
  var sslPort = 443;
  if (process.argv[3]) {
    sslPort = parseInt(process.argv[3]);
  }
  // Create the HTTPS proxy server in front of an HTTP server
  httpProxy.createServer({
    target: {
      host: 'localhost',
      port: port
    },
    ssl: {
      key: sslOptions.key,
      cert: sslOptions.cert
    },
    xfwd: true
  }).listen(sslPort);
  console.log(('Reverse Proxy Server started at SSL port ' + sslPort + ' ...').info);
}

// print out the route mapping information
console.log('');
console.log('Route mappings are as follows:'.info);
console.log('***********************************************************'.info);
console.log(mappings);
console.log('***********************************************************'.info);
console.log('');
