var Products = require('../models/products');
var Translations = require('../models/translations');
var StartPageMarketingMessages = require('../models/startPage/startPageMarketingMessages');

var config = require('../config');

const fbIndents = [ 'facebookexternalhit', 'Facebot'];
//const fbIndents = [ 'facebookexternalhit', 'Facebot', 'moz'];

function standartAnswer (callback) {
    const siteUrl = 'http://' + config.hostname + '/';
    StartPageMarketingMessages.findOne({"version": 0})
    .exec(function(err, result){
        if (result) {
            const title = result.text;
            const image = siteUrl + 'images/' + result.image;
    
            Translations.findOne({lang: 'hebrew'}, function (err, result) {
                if (result) {
                    const site_name = result.topNavigation.logoTitle;
    
                    const answer = `
                    <!DOCTYPE html>
                    <html lang="en" dir="rtl">
                    <head>
                    <meta http-equiv="content-type" content="text/html; charset=utf-8">
                    <meta charset="utf-8">
                    <title>${site_name}</title>
                    <meta property="og:url" content="${siteUrl}"/>
                    <meta property="og:title" content="${title}"/>
                    <meta property="og:image" content="${image.toString()}"/>            
                    <meta property="og:site_name" content="${site_name}"/>
                    </head>
                    <body>
                    </body>
                    <html>
                    `;
                    callback (null, answer);
                } else {
                    console.log(err);
                    err.status = 500;
                    return callback(err, null);
                }
            });
        } else {
            console.log(err);
            err.status = 500;
            return callback(err, null);
        }
    });
}


exports.facebookAnswer = function (userAgent, url, callback) {
    // Product link
    for (let i = 0; i < fbIndents.length; i++) {
        if (userAgent.toLowerCase().indexOf(fbIndents[i].toLowerCase()) >= 0) {
            if (url.toLowerCase().indexOf('product/') > 0) {
                let promoLink = url.substring(url.lastIndexOf('product/') + 8, url.length);
                if (promoLink.lastIndexOf('/') > 0) {
                    promoLink = promoLink.substring(0, promoLink.lastIndexOf('/'));
                }
                Products.findOne({'promoLink': promoLink}, (err, result) => {
                    if (result) {
                        const product = result;
                        Translations.findOne({lang: 'hebrew'}, function (err, result) {
                            if (result) {
                                const site_name = result.topNavigation.logoTitle;
                                let answer = `
                                <!DOCTYPE html>
                                <html lang="en" dir="rtl">
                                <head>
                                <meta http-equiv="content-type" content="text/html; charset=utf-8">
                                <meta charset="utf-8">
                                <title>${site_name}</title>
                                <meta property="og:url" content="http://${config.hostname}/product/${product.promoLink}"/>
                                <meta property="og:title" content="${product.title}"/>
                                <meta property="og:image" content="http://${config.hostname}/images/${product.frontImage.hiRes.toString()}"/>
                                <meta property="og:site_name" content="${site_name}"/>
                                </head>
                                <body>
                                </body>
                                <html>
                                `;
                                callback (null, answer);
        
                            } else {
                                standartAnswer((err, answer) => {
                                    if (err) {
                                        return callback (err, null);
                                    }
                                    callback (null, answer);
                                });
                            }
                        });
                    } else {
                        standartAnswer((err, answer) => {
                            if (err) {
                                return callback (err, null);
                            }
                            callback (null, answer);
                        });
                    }
                });
            } else {
                standartAnswer((err, answer) => {
                    if (err) {
                        return callback (err, null);
                    }
                    callback (null, answer);
                });
            }
        } else if (i === (fbIndents.length - 1)) {
            callback(null, null);
        }
    }
};