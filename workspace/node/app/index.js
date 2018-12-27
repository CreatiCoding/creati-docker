// 디팬던시
var express = require('express');
var uuid = require('uuid');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');

var app = express();
var id = uuid.v4();
var port = 3000;

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
// setup the logger
app.use(morgan('dev', { stream: accessLogStream }));

app.get('/', function (req, res) {
  res.send(id)
});

app.listen(port, function () {
  console.log('Example app listening on port: ' + port);
});
