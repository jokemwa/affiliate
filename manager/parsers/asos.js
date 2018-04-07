// ASOS parser

var secrets = require('../../_secrets');

var cheerio = require('cheerio');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
        var $=cheerio.load(page);
        var imageJSONs = [];

        $('.image-thumbnail').each(function(i, elem) {
            let part = cheerio.load($(this).html());
            let url = part('img').attr('src');
            let imageURL = url.substring(0, url.indexOf("?"));
            let imageJSON = {
                "hiRes": imageURL+"?$XXL$",
                "thumb": imageURL+"?$S$"
            };
            imageJSONs.push(imageJSON);
        });

        if(imageJSONs.length == 0){
            reject("Parser error");
        }

        // Title
        let title = "";
        
        var $=cheerio.load(page);
        let part = cheerio.load($('.product-hero').html());
        title = part('h1').text();

        if (title.length == 0){
            reject("Parser error");
        }

        // Buy Link
        let buyLink = 'https://click.linksynergy.com/deeplink?id=' + secrets.ASOS.rakuten_id
        + '&mid=' + secrets.RAKUTEN.mid + '&murl=' + encodeURIComponent(extLink);

        resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});
    });
};

exports.hasAPI - false;
exports.parsePrice = function(extLink, page) {
    return new Promise(function(resolve, reject){
        try {
            let priceObject = JSON.parse(page.match(/\"price\":{(.*?)}/g)[0].substring(8));

            let answer = {
                priceString: priceObject.current + priceObject.currency,
                discString: priceObject.previous + priceObject.currency
            };
            resolve(answer);
        } catch (err) {
            let answer = {
                priceString: null,
                discString: null
            };
            resolve(answer);
        }
        
    });
}



/*
exports.parseImages = function (page){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $=cheerio.load(page);

        $('.image-thumbnail').each(function(i, elem) {
            let part = cheerio.load($(this).html());
            let url = part('img').attr('src');
            let imageURL = url.substring(0, url.indexOf("?"));
            let imageJSON = {
                "hiRes": imageURL+"?$XXL$",
                "thumb": imageURL+"?$S$"
            };
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
        let part = cheerio.load($('.product-hero').html());
        title = part('h1').text();

        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};
*/
