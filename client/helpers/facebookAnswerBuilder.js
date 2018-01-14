var Products = require('../models/products');
var Translations = require('../models/translations');
var StartPageMarketingMessages = require('../models/startPage/startPageMarketingMessages');

var config = require('../config');

const fbIndents = [ 'facebookexternalhit', 'Facebot'];
//const fbIndents = [ 'facebookexternalhit', 'Facebot', 'moz'];

function standartAnswer (callback) {
    let siteUrl = 'http://' + config.hostname;
    siteUrl = encodeURI(siteUrl);
    StartPageMarketingMessages.findOne({"version": 0})
    .exec(function(err, result){
        if (result) {
            let title = result.text;
            title = title.replace(/"/g, ' ');
            title = title.replace(/'/g, ' ');
            let image = siteUrl + '/images/' + result.image;
            image = encodeURI(image);
    
            Translations.findOne({lang: 'hebrew'}, function (err, result) {
                if (result) {
                    let site_name = result.topNavigation.logoTitle;
                    site_name = site_name.replace(/"/g, ' ');
                    site_name = site_name.replace(/'/g, ' ');
    
                    const answer = `
                    <!DOCTYPE html>
                    <html lang="he" dir="rtl">
                    <head>
                    <meta http-equiv="content-type" content="text/html; charset=utf-8">
                    <meta charset="utf-8">
                    <title>${site_name}</title>
                    <meta property="og:url" content="${siteUrl}"/>
                    <meta property="og:title" content="${title}"/>
                    <meta property="og:image" content="${image}"/>            
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
                                let site_name = result.topNavigation.logoTitle;
                                site_name = site_name.replace(/"/g, ' ');
                                site_name = site_name.replace(/'/g, ' ');
                                let site_url = encodeURI('http://' + config.hostname + '/product/' + product.promoLink);
                                let title = product.title;
                                title = title.replace(/"/g, ' ');
                                title = title.replace(/'/g, ' ');
                                let image = encodeURI('http://' + config.hostname + '/images/' + product.frontImage.hiRes);
                                let answer = `
                                <!DOCTYPE html>
                                <html lang="he" dir="rtl">
                                <head>
                                <meta http-equiv="content-type" content="text/html; charset=utf-8">
                                <meta charset="utf-8">
                                <title>${site_name}</title>
                                <meta property="og:image" content="${image}"/>
                                <meta property="og:url" content="${site_url}"/>
                                <meta property="og:title" content="${title}"/>
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