// GearBest parser
const awinmid = '6607';
const awinaffid = '460206';

var cheerio = require('cheerio');


exports.parseImages = function (page){
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
    let buyLink = 'https://www.awin1.com/cread.php?awinmid=' + awinmid
    + '&awinaffid=' + awinaffid + '&clickref=&p=' + encodeURIComponent(extLink);
    return  buyLink

};

