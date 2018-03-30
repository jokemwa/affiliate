// Base.com parser
var secrets = require('../_secrets');

var cheerio = require('cheerio');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
        var imageJSONs = [];

        var $ = cheerio.load(page);

        let filename = $('img[id=mainImage]').attr('src');
        for(let i=filename.length-1; i >= 0; i--){
            if(filename[i] == "/"){
                filename = filename.substring(i+1);
                break;
            }
        }
        imageJSONs.push({
            "hiRes": "https://www.base.com/images/zoom/" + filename,
            "thumb": "https://www.base.com/images/standard-lclip/" + filename
        });

        if(page.indexOf('class="more-images"') >= 0){
            let part = cheerio.load($('.more-images').html());
        
            part('img').each(function(i, elem) {
                filename = $(this).attr('src');
                
                for(let i=filename.length-1; i >= 0; i--){
                    if(filename[i] == "/"){
        
                        filename = filename.substring(i+1);
                        break;
                    }
                }
                let imageJSON = {
                    "hiRes": "https://www.base.com/images/largemedia/" + filename,
                    "thumb": "https://www.base.com/images/media-thumb/" + filename
                };
                imageJSONs.push(imageJSON);
            });
        }

        if(imageJSONs.length == 0){
            reject("Parser error");
        }

        // Title
        let title = "";
        
        var $=cheerio.load(page);

        title = $('title').text();
        
        if(title.length == 0){
            reject("Parser error");
        }

        // buy Link
        let buyLink = 'https://www.awin1.com/cread.php?awinmid=' + secrets.BASE.awinmid
        + '&awinaffid=' + secrets.AWIN.affid + '&clickref=&p=' + encodeURIComponent(extLink);

        resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});

    });
}

exports.parseImages = function (page, extLink){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $ = cheerio.load(page);

        let filename = $('img[id=mainImage]').attr('src');
        for(let i=filename.length-1; i >= 0; i--){
            if(filename[i] == "/"){
                filename = filename.substring(i+1);
                break;
            }
        }
        imageJSONs.push({
            "hiRes": "https://www.base.com/images/zoom/" + filename,
            "thumb": "https://www.base.com/images/standard-lclip/" + filename
        });

        if(page.indexOf('class="more-images"') >= 0){
        let part = cheerio.load($('.more-images').html());
        

        part('img').each(function(i, elem) {
            filename = $(this).attr('src');
            
            for(let i=filename.length-1; i >= 0; i--){
                if(filename[i] == "/"){
    
                    filename = filename.substring(i+1);
                    break;
                }
            }
            let imageJSON = {
                "hiRes": "https://www.base.com/images/largemedia/" + filename,
                "thumb": "https://www.base.com/images/media-thumb/" + filename
            };
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

        title = $('title').text();
        
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

exports.hasAPI - false;
exports.parsePrice = function(extLink, page) {
    return new Promise(function(resolve, reject){
        $ = cheerio.load(page);
        let part1 = $('#main_frame > div.product-main-detail.product-main > div > div:nth-child(3) > div > span.price');
        let part2 = $('#main_frame > div.product-main-detail.product-main > div > div:nth-child(3) > div > p > strike');
  
        resolve({
            priceString: part1.text(),
            discString: part2.text()
        });
    });
};

