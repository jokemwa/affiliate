// FragranceX parser

var cheerio = require('cheerio');


exports.parseImages = function (page){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $=cheerio.load(page);


        let parts = $('.product-reviews').first();
        let cut = parts.html();
        if(cut.indexOf('<div class="stock') >= 0){
        cut = cut.substring(0, cut.indexOf('<div class="stock'));
        }
        //console.log(parts.html());
        let part = cheerio.load(cut);
        part('.media').each(function(i, elem) {

            console.log(i);
            let part2 = cheerio.load($(this).html());
            //console.log($(this).html());
            let part4 = part2('.acenter').html();
            //console.log(part4);
            part4 = part4.substring(part4.indexOf("https:"), part4.indexOf(".jpg")+4);
            //console.log(part4);


            let part3 = cheerio.load(part2('.acenter').html());
            //console.log(part3('.nonebold').attr('data-featherlight'));


            
            var imageJSON = {
                "hiRes": part3('.nonebold').attr('data-featherlight'),
                "thumb": part4
            };
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

exports.parseTitle = function(page, extLink){
    return new Promise(function(resolve, reject){

        let title = "";

        var $=cheerio.load(page);

        let part = cheerio.load($('.product-hero-scale').html());
        title = part('h1').text();

        
        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};

