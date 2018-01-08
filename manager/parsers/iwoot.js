// IWOOT parser
var secrets = require('../_secrets');

var cheerio = require('cheerio');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
        var imageJSONs = [];

        var $=cheerio.load(page);

        var parts = cheerio.load($('.product-large-view-thumbs').html());
        parts('li').each(function(i, elem) {
            let imageJSON = {
                "hiRes": "",
                "thumb": ""
            };
            let part = cheerio.load($(this).html());

            imageJSON.hiRes = part('a').attr('href');
            imageJSON.thumb = part('img').attr('src');

            imageJSONs.push(imageJSON);
        });

        if(imageJSONs.length == 0){
            reject("Parser error");
        }

        // Title
        let title = "";

        var $=cheerio.load(page);
        let part = cheerio.load($('.product-large-view-title').html());
        title = part('span').text();

        if(title.length == 0){
            reject("Parser error");
        }

        // Buy Link
        let buyLink = 'https://www.awin1.com/cread.php?awinmid=' + secrets.IWOOT.awinmid
        + '&awinaffid=' + secrets.AWIN.affid + '&clickref=&p=' + encodeURIComponent(extLink);

        resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});
    });
}

exports.parseImages = function (page, extLink){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $=cheerio.load(page);

        var parts = cheerio.load($('.product-large-view-thumbs').html());
        parts('li').each(function(i, elem) {
            let imageJSON = {
                "hiRes": "",
                "thumb": ""
            };
            let part = cheerio.load($(this).html());

            imageJSON.hiRes = part('a').attr('href');
            imageJSON.thumb = part('img').attr('src');

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
        let part = cheerio.load($('.product-large-view-title').html());
        title = part('span').text();

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

