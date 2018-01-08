// 365games parser
var secrets = require('../_secrets');

var cheerio = require('cheerio');


exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
        var $=cheerio.load(page);
        var imageJSONs = [];

        $('.product_thumb').each(function(i, elem) {
            imageJSONs.push({
                "hiRes": $(this).attr('href'),
                "thumb": $(this).attr('href')
            });
        });

        if(imageJSONs.length == 0){
            let part = cheerio.load($('a[id=product_image] ').html());
            imageJSONs.push({
                "hiRes": part('img').attr('src'),
                "thumb": part('img').attr('src')
            });
        }

        if(imageJSONs.length == 0){
            reject("Parser error");
        }

        // Title
        let title = "";
        
        var $=cheerio.load(page);

        let part = cheerio.load($('span[itemprop=name]').html());
        title = part('h1').text();
        
        if(title.length == 0){
            reject("Parser error");
        }

        // Buy Link
        let buyLink = 'https://www.awin1.com/cread.php?awinmid=' + secrets.GAMES365.awinmid
        + '&awinaffid=' + secrets.AWIN.affid + '&clickref=&p=' + encodeURIComponent(extLink);

        resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});

    });
}

exports.parseImages = function (page, extLink){
    return new Promise(function(resolve, reject){

        var $=cheerio.load(page);
        var imageJSONs = [];

        $('.product_thumb').each(function(i, elem) {
            imageJSONs.push({
                "hiRes": $(this).attr('href'),
                "thumb": $(this).attr('href')
            });
        });

        if(imageJSONs.length == 0){
            imageJSONs.push({
                "hiRes": $('a[id=product_image]').attr('href'),
                "thumb": $('a[id=product_image]').attr('href')
            });
        }

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

        let part = cheerio.load($('span[itemprop=name]').html());
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

