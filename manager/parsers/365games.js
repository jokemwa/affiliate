// 365games parser

var cheerio = require('cheerio');

exports.parseImages = function (page){
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

