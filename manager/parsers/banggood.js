// BangGood parser
var secrets = require('../_secrets');

var cheerio = require('cheerio');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
        var imageJSONs = [];

        var $=cheerio.load(page);

        let part = cheerio.load($('.good_photo_min').html());
        part('a').each(function(i, elem) {
            var imageJSON = {
                "hiRes": 'http://' + $(this).attr('big').substring(2),
                "thumb": ""
            };
            let part2 = cheerio.load($(this).html());
            imageJSON.thumb = 'http://' + part2('img').attr('src').substring(2);
            //console.log(imageJSON);
            
            imageJSONs.push(imageJSON);
        });

        if(imageJSONs.length == 0){
            reject("Parser error");
        }

        // Title
        let title = "";
        for(let i=extLink.length-1; i>=0; i--){
            if(extLink[i] == "/"){
                title = extLink.substring(i+1, extLink.indexOf(".html"));
                break;
            }
        }

        if(title.length == 0){
            reject("Parser error");
        }

        // Buy Link
        let buyLink = extLink.substring(0, extLink.indexOf('?'))
        + '?p=' + secrets.BANGGOOD.accountId;

        resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});
    });
}

/*
exports.parseImages = function (page, extLink){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $=cheerio.load(page);

        let part = cheerio.load($('.good_photo_min').html());
        part('a').each(function(i, elem) {
            var imageJSON = {
                "hiRes": $(this).attr('big'),
                "thumb": ""
            };
            let part2 = cheerio.load($(this).html());
            imageJSON.thumb = part2('img').attr('src');
            //console.log(imageJSON);
            
            imageJSONs.push(imageJSON);
        });

        if(imageJSONs.length == 0){
            reject("Parser error");
        }else{
        resolve(imageJSONs);
        }

    });

};
*/

exports.parseTitle = function(page, extLink){
    return new Promise(function(resolve, reject){

        let title = "";
        for(let i=extLink.length-1; i>=0; i--){
            if(extLink[i] == "/"){
                title = extLink.substring(i+1, extLink.indexOf(".html"));
                break;
            }
        }

        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};

exports.parseBuyLink = function(extLink){
    return new Promise(function(resolve, reject){
        let buyLink = extLink.substring(0, extLink.indexOf('?'))
    + '?p=' + bg_account_id;
        
        resolve(buyLink);
    });
};

exports.hasAPI - false;
exports.parsePrice = function(extLink, page) {
    return new Promise(function(resolve, reject){
        $ = cheerio.load(page);
        let part1 = $('div.price > div.item_con > div.now');
        let part2 = $('div.price > div.item_con > div.old');

        let answer = {
            priceString: part1.attr('oriprice') + '$',
            discString: part2.attr('oriprice') + '$'
        };
        console.log(answer);
        resolve(answer);
    });
}