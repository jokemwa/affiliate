var config = require('../config');

var http = require('http');
var debug = require('debug')('server:server');
var express = require('express');
var logger = require('morgan');

var app = express();
app.use(logger('dev'));

app.set('port', config.portExchangeRate);
app.set('mode', 'development');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-session-id, x-device-id");
  next();
});

// REST Routes
var exchange = require('./routes/exchange');
app.use('/exchange', exchange);

// Error cases
// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //console.log(err);
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    console.log({status: err.status, message: err.message});
    res.json({status: err.status, message: err.message});
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
  
    var bind = typeof app.get('port') === 'string'
      ? 'Pipe ' + app.get('port')
      : 'Port ' + app.get('port');
  
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