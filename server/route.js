module.exports = function(app, express) {
    var configuration = require('./configuration.js');
    var path = require('path');

    var url = __dirname + '/../';

    __dirname = path.join(url);

    console.log("lksdfdsf");

    app.get('/', function(req, res) {
        res.render(__dirname + configuration._webUrl + '/index.html');
    });

    return module.exports;

}
