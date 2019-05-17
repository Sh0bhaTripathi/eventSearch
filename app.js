// /**
//  * App Server File.
//  */

const express = require('express'); // Express to run server
const app = express();
const bodyParser = require('body-parser'); // Body Parser
const fs = require('fs');
const cookieParser = require('cookie-parser'); // Cookie parser
const flash = require('connect-flash');
const path = require('path');

var expressSession = require('express-session');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3092');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var config = require('./config/config');

app.use(cookieParser()); // Initialize cookie parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(flash());

// required for passport
app.use(expressSession({
    secret: 'mySecret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'dist/eventSearch')));
app.use('/', express.static(path.join(__dirname, 'dist/eventSearch')));


var port = config.port;
console.log(port);
var router = express.Router();
app.use('/api/v1', router);

server.listen(port, () => {
    console.log("server started at :", port);
    //Enable jsonp
    var walk = function(path) {

        fs.readdirSync(path).forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js$|coffee$)/.test(file)) {
                    require(newPath);
                }
            } else if (stat.isDirectory()) {
                walk(newPath);
            }

        });

         
    };
    require('./app/routes/messageRoute')(server, router);
});

process.on('uncaughtException', (err) => {
    console.error("<<<<<-----     error in      ----->>>", err);
   
});

module.exports = app;
