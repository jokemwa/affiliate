var config = require('./config');

var http = require('http');
var debug = require('debug')('server:server');
var path = require("path");
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var pug = require('pug');

var mongoose = require('mongoose');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected correctly to MongoDB");
});

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('port', config.port);
app.set('mode', 'development');

// REST Routes
var images = require('./routes/images');
app.use('/images', images);
var client = require('./routes/client');
app.use('/api/client', client);
var startPage = require('./routes/startPage');
app.use('/api/start-page', startPage);
var products = require('./routes/products');
app.use('/api/products', products);
var translation = require('./routes/translation');
app.use('/api/translation', translation);
var brands = require('./routes/brands');
app.use('/api/brands', brands);
var categories = require('./routes/categories');
app.use('/api/categories', categories);
var search = require('./routes/search');
app.use('/api/search', search);

// Static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Angular4 client
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });


// Error cases
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

var server = http.createServer(app);

server.listen(app.get('port'), function() {
  console.log('Server listening on port', app.get('port'));
});
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof config.port === 'string'
      ? 'Pipe ' + config.port
      : 'Port ' + config.port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }