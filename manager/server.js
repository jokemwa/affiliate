var config = require('./config');

var https = require('https');
var fs = require('fs');
var debug = require('debug')('server:server');
var path = require("path");
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var pug = require('pug');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to MongoDB");
});

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// passport config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('port', config.port);
app.set('mode', 'development');

// REST Routes
var images = require('./routes/images');
app.use('/images', images);
app.use('/api/images', images);

var startPage = require('./routes/startPage');
app.use('/api/start-page', startPage);

var badges = require('./routes/badges');
app.use('/api/badges', badges);
var brands = require('./routes/brands');
app.use('/api/brands', brands);
var categories = require('./routes/categories');
app.use('/api/categories', categories);
var products = require('./routes/products');
app.use('/api/products', products);
var shops = require('./routes/shops');
app.use('/api/shops', shops);
var tags = require('./routes/tags');
app.use('/api/tags', tags);
var marketplaces = require('./routes/marketplaces');
app.use('/api/marketplaces', marketplaces);
var startPage = require('./routes/startPage');
app.use('/api/startpage', startPage);
var translation = require('./routes/translation');
app.use('/api/translation', translation);
var user = require('./routes/user');
app.use('/api/user', user);
var file = require('./routes/file');
app.use('/api/file', file);
var shopGroups = require('./routes/shopGroups');
app.use('/api/shopgroups', shopGroups);

//var createUser = require('./routes/createUser');
//app.use('/api/createuser', createUser);

// Images
app.use('/img', express.static(path.join(__dirname, 'img')));

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

var options = {
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt')
};
var server = https.createServer(options, app);

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