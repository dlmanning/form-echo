var http = require('http');
var fs   = require('fs');
var util = require('util');
var qs   = require('querystring');

var concat      = require('concat-stream');
var jade        = require('jade');
var styleInjector = require('style-injector');

var portNum = 3000;

var echoJadeTemplate = fs.readFileSync(__dirname + '/echo.jade', {encoding: 'utf8'});
var css = fs.readFileSync(__dirname + '/public/pure-min.css', {encoding: 'utf8'});
var echoTemplate = jade.compile(echoJadeTemplate);
var cssInjected = styleInjector(css);

http.createServer(function (req, res) {
  var body, form;

  if (req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/form.html').pipe(res);
  } 
  else if (req.method === 'POST' && req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    req.pipe(concat(function (body) {
      var form;

      form = qs.parse(body.toString());

      res.writeHead(200, {'Content-Type': 'text/html'});
      cssInjected.pipe(res);

      cssInjected.end(echoTemplate( {formParams: form} ));
    }));
  }
}).listen(portNum);

console.log('Listening on port ' + portNum);