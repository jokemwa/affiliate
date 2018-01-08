// ArtsCow parser

var cheerio = require('cheerio');


exports.parseImages = function (page){
    return new Promise(function(resolve, reject){

        var imageJSONs = [];

        var $ = cheerio.load(page);
        
        let firstImageJSON = {
            hiRes: "",
            thumb: ""
        };
        let part1 = cheerio.load($('div[id=divMainImage]').html());
        let imageString = part1('img').attr('src');
        let a = imageString.split('-');
        if (a.length >= 2) {
            a[a.length - 2] = 4;
            firstImageJSON.hiRes  = a.join('-');
        }
        a = imageString.split('-');
        if (a.length >= 2) {
            a[a.length - 2] = 1;
            firstImageJSON.thumb  = a.join('-');
        }
        imageJSONs.push(firstImageJSON);

        if(page.indexOf('class="other-image"') >= 0){
            let part2 = cheerio.load($('.other-image').html());
            part2('img').each(function(i, elem) {
                let imageJSON = {
                    hiRes: "",
                    thumb: ""
                };
                imageString = $(this).attr('src');
                let a = imageString.split('-');
                if (a.length >= 2) {
                    a[a.length - 2] = 4;
                    imageJSON.hiRes  = a.join('-');
                }
                a = imageString.split('-');
                if (a.length >= 2) {
                    a[a.length - 2] = 1;
                    imageJSON.thumb  = a.join('-');
                }
                imageJSONs.push(imageJSON);
            });
        }

        //console.log(imageJSONs);

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

        title = $('.product-title').text();

        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};

