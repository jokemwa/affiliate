// eChemist parser
var secrets = require('../_secrets');

var cheerio = require('cheerio');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
        var imageJSONs = [];

        var $ = cheerio.load(page);

        var part = cheerio.load($('.product-image').html());

        var part1 = cheerio.load(part('ul[id=image-slider]').html());
        part1('li').each(function(i, elem) {
            let imageJSON = {
                "hiRes": "",
                "thumb": ""
            };
            let party = cheerio.load($(this).html());

            imageJSON.hiRes = party('img').attr('src');
            imageJSONs.push(imageJSON);
        });

        var part2 = cheerio.load(part('.image-pager').html());
        var part3 = cheerio.load(part2('li').html());
        part3('a').each(function(i, elem) {
            let party = cheerio.load($(this).html());
            imageJSONs[i].thumb = party('img').attr('src');
        });

        if(imageJSONs.length == 0){
            reject("Parser error");
        }

        // Title
        let title = "";

        var $ = cheerio.load(page);

        var part = cheerio.load($('.right-side').html());
        title = part('h1').text();

        if(title.length == 0){
            reject("Parser error");
        }

        // Buy Link
        let buyLink = 'https://www.awin1.com/cread.php?awinmid=' + secrets.ECHEMIST.awinmid
        + '&awinaffid=' + secrets.AWIN.affid + '&clickref=&p=' + encodeURIComponent(extLink);

        resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});
    });
}


exports.parseImages = function (page, extLink){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $ = cheerio.load(page);

        var part = cheerio.load($('.product-image').html());

        var part1 = cheerio.load(part('ul[id=image-slider]').html());
        part1('li').each(function(i, elem) {
            let imageJSON = {
                "hiRes": "",
                "thumb": ""
            };
            let party = cheerio.load($(this).html());

            imageJSON.hiRes = party('img').attr('src');
            imageJSONs.push(imageJSON);
        });

        var part2 = cheerio.load(part('.image-pager').html());
        var part3 = cheerio.load(part2('li').html());
        part3('a').each(function(i, elem) {
            let party = cheerio.load($(this).html());
            imageJSONs[i].thumb = party('img').attr('src');
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

        var $ = cheerio.load(page);

        var part = cheerio.load($('.right-side').html());
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

