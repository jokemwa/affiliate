var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

router.use(bodyParser.json());

router.route('/')
.post( function (req, res, next) {
    console.log(req.body.link);

    var options = {
        uri: req.body.link,
        method:'GET',
        headers: {
            //'User-Agent': "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:36.0) Gecko/20100101 Firefox/36.0",
        }
    };
    request(options,
    function (err, result, page) {
        var $=cheerio.load(page);
        //Идём по DOM-дереву обычными CSS-селекторами
        img_src=$('span[id="productTitle"]').text();
        console.log(img_src);
        res.status(200).json({
            result: img_src
        });
    });
    /*var options = {
        hostname: "www.amazon.com",
        port: 443,
        path: '/gp/product/B0757FR7MY/',
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',

        }

    };
    https.get(options).on('response', function (response) {
        var body = "";
        var i = 0;
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            //Передаём страницу в cheerio
        console.log(body);
        var $ = cheerio.load(body);
        //Идём по DOM-дереву обычными CSS-селекторами
        img_src=$('img[id="landingImage"]').attr("src");
        console.log(img_src);
        });
    });*/

});

/* 
router.route('/')
    .get(Verify.verifyAdmin, function (req, res, next) {
        User.find({}, function (err, users) {
            if (err) throw err;
            res.json(users);
        });
    });



router.post('/signup', function (req, res) {
    User.register(new User({ username: req.body.username }),
        req.body.password, function (err, user) {
            if (err) {
                return res.status(500).json({ 
                    status: "singup_error",
                    err: err });
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({ 
                    status: 'singup_success' });
            });
        });
});

router.post('/signin', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken(user);
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});
GET users listing. */

module.exports = router;
