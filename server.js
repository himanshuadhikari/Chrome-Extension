var express = require('express');
var app = express();
var route = require("./server/route.js")(app, express);
var util = require('util');

// var userDao = require("./server/userDao.js");


app.use('/static/', express.static(__dirname + "/public"));
app.engine('html', require('ejs').renderFile);

var port = process.env.PORT || 4444;

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
    console.log('Example app listening at  http://localhost:%s', port);
});
