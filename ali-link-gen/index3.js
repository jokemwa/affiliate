const secrets = require('../_secrets');
const config = require('../config');

const puppeteer = require('puppeteer');
var http = require('http');
var debug = require('debug')('server:server');
var express = require('express');
var logger = require('morgan');

const id = secrets.ALIEXPRESS.id;
const pasw = secrets.ALIEXPRESS.pasw;
const login_url = 'https://login.aliexpress.com/?flag=1&return_url=http%3A%2F%2Fportals.aliexpress.com%2Fwelcome.htm';
const gen_url = 'https://portals.aliexpress.com/adcenter/generateUrl.htm';
const delay = 50;

var app = express();
app.use(logger('dev'));

app.set('port', config.portAliLinkGen);
app.set('mode', 'development');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-session-id, x-device-id");
    next();
});


app.get('/:link', (req, res, next) => {
        const link = decodeURIComponent(req.params.link);
        console.log(link);
        puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']}).then(browser => {
            console.log('Puppeteer launched.');
            browser.newPage().then(page => {
                page.goto(login_url).then(() => {
                    var frames = page.frames();
                    var loginFrame = frames.find(f =>
                        f.url().indexOf("mini_login") > 0);
                    loginFrame.$("#fm-login-id").then(login_field => {
                        login_field.type(id, {delay: delay}).then(() => {
                            loginFrame.$("#fm-login-password").then(pasw_field => {
                                pasw_field.type(pasw, {delay: delay}).then(() => {
                                    loginFrame.$("#fm-login-submit").then(login_button => {
                                        login_button.click().then(() => {
                                            page.waitForNavigation().then((response) => {
                                                page.goto(gen_url, {waitUntil: 'networkidle0'}).then(() => {
                                                    (async () => {
                                                        await page.type('[name="targetUrl"]', link);
                                                        await page.click('[name="eventSubmitDoGenerateUrl"]');
                                                        await page.waitForSelector('.generate-result-box');
                                                        if (await page.$('.ui-feedback-error') !== null) {
                                                            console.log('error');
                                                            res.status(400);
                                                            res.json({status: 400, message: 'URL is not promoted'});
                                                        }
                                                        else {
                                                            const buyLink = await page.evaluate(() => document.querySelector('.generate-result-box').innerText)
                                                            console.log(buyLink);
                                                            res.json({link: buyLink});                                        
                                                        }                                                      
                                                        await browser.close();
                                                    })();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });                        
                    });
                });
            });
        });
});
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

server.on('error', onError);
server.on('listening', onListening);
server.listen(app.get('port'), function() {
    console.log('Server listening on port', app.get('port'));
});

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
    debug('Listening on ' + app.get('port'));
}

