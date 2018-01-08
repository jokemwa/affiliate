// ASOS parser

var cheerio = require('cheerio');

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

