// GearBest parser
var secrets = require('../_secrets');

var cheerio = require('cheerio');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
        var imageJSONs = [];

        var $=cheerio.load(page);

        var part = cheerio.load($('.js_scrollableDiv').html());
        part('img').each(function(i, elem) {
            let imageJSON = {
                "hiRes": "",
                "thumb": ""
            };
            imageJSON.hiRes = $(this).attr('data-big-img');
            if($(this).attr('data-src')){
                imageJSON.thumb = $(this).attr('data-src');
            } else {
                imageJSON.thumb = $(this).attr('data-original');
            }
            imageJSONs.push(imageJSON);
        });

        if(imageJSONs.length == 0){
            reject("Parser error");
        }

        // Title
        let title = "";

        var $=cheerio.load(page);
        part = cheerio.load($('div .goods-info-top').html());
        title = part('h1').text();

        if(title.length == 0){
            reject("Parser error");
        }

        // Buy Link
        let buyLink = 'https://www.awin1.com/cread.php?awinmid=' + secrets.GEARBEST.awinmid
        + '&awinaffid=' + secrets.AWIN.affid + '&clickref=&p=' + encodeURIComponent(extLink);

        resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});
    });
}


exports.parseImages = function (page, extLink){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $=cheerio.load(page);

        var part = cheerio.load($('.js_scrollableDiv').html());
        part('img').each(function(i, elem) {
            let imageJSON = {
                "hiRes": "",
                "thumb": ""
            };
            imageJSON.hiRes = $(this).attr('data-big-img');
            if($(this).attr('data-src')){
                imageJSON.thumb = $(this).attr('data-src');
            } else {
                imageJSON.thumb = $(this).attr('data-original');
            }
            imageJSONs.push(imageJSON);
        });

        if(imageJSONs.length == 0){
            reject("Parser error");
        }else{
        resolve(imageJSONs);
        }
        

    });

};

exports.parseTitle = function(page, extLink){
    return new Promise(function(resolve, reject){

        let title = "";

        var $=cheerio.load(page);
        let part = cheerio.load($('div .goods-info-top').html());
        title = part('h1').text();

        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};

exports.parseBuyLink = function(extLink){
    return new Promise(function(resolve, reject){
        let buyLink = 'https://www.awin1.com/cread.php?awinmid=' + awinmid
    + '&awinaffid=' + awinaffid + '&clickref=&p=' + encodeURIComponent(extLink);
        
        resolve(buyLink);
    });
};

exports.hasAPI - false;
exports.parsePrice = function(extLink, page) {
    return new Promise(function(resolve, reject){
        var $=cheerio.load(page);
        let priceString = $('b.my_shop_price').attr('data-orgp');
        if (!priceString) priceString = $('span.new_shop_price').attr('data-orgp');
        let discString = $('b.my_shop_price').attr('data-shopprice');
        if (!discString) discString = $('span.new_shop_price').attr('data-shopprice');
        resolve({
            priceString: priceString +'$',
            discString: discString +'$'
        });
    });
}

