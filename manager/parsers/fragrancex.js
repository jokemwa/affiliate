// FragranceX parser
var secrets = require('../_secrets');

var cheerio = require('cheerio');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
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
        }

        // Title
        let title = "";

        var $=cheerio.load(page);

        part = cheerio.load($('.product-hero-scale').html());
        title = part('h1').text();

        
        if(title.length == 0){
            reject("Parser error");
        }

        // Buy Link
        let buyLink = 'http://www.anrdoezrs.net/links/' + secrets.CJ.siteId
        + '/type/dlg/' + extLink;

        resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});
    });
}

exports.parseImages = function (page, extLink){
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

exports.parseBuyLink = function(extLink){
    return new Promise(function(resolve, reject){
        let buyLink = 'http://www.anrdoezrs.net/links/' + cj_siteid
        + '/type/dlg/' + extLink;
        
        resolve(buyLink);
    });
};

exports.hasAPI - false;
exports.parsePrice = function(extLink, page) {
    return new Promise(function(resolve, reject){
        var $=cheerio.load(page);
        let minPrice = {
            val: Number.MAX_VALUE,
            string: null
        };
        $('p.new-price').each(function(i, elem) {
            let val = parseFloat($(this).text().match(/[-]?[0-9]+([.]?[,]?[0-9]+)?/gi)[0].replace(/,/g, '.'), 10);
            if (val <= minPrice.val) {
                minPrice = {
                    val: val,
                    string: $(this).text()
                };
            }
        });
        resolve({
            priceString: minPrice.string,
            discString: null
        });
    });
}

