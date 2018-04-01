// AliExpress parser
var secrets = require('../../_secrets');
var config = require('../../config');

var request = require('request');
var cheerio = require('cheerio');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        
        // Images
        const imageJSONs = [];
        let hiResimageString = page.substring((page.indexOf("window.runParams.imageBigViewURL=[")+34), page.indexOf("];", page.indexOf("window.runParams.imageBigViewURL=[")));
        hiResimageString = hiResimageString.replace(/\n/g, '');
        hiResimageString = hiResimageString.replace(/\t/g, '');
        hiResimageString = hiResimageString.replace(/"/g, '');
        
        let hiResURLArray = hiResimageString.split(",");
        var $=cheerio.load(page);

        $('.img-thumb-item').each(function(i, elem) {
            let part = cheerio.load($(this).html());
            let imageJSON = {
                "hiRes": hiResURLArray[i],
                "thumb": part('img').attr('src')
            };
            
            imageJSONs.push(imageJSON);
        });

        if (imageJSONs.length == 0) {
            reject("Parser error: " + "images field");
        }

        // Title
        let title = "";
        if(extLink.indexOf("item/")>=0){
            title = extLink.substring(extLink.indexOf("item/")+5, extLink.indexOf("/", extLink.indexOf("item/")+5));
            }
    
        if(extLink.indexOf("product/")>=0){
            title = extLink.substring(extLink.indexOf("product/")+8, extLink.indexOf("/", extLink.indexOf("product/")+8));
        }
        
        if (title.length == 0) {
            reject("Parser error: " + "title field");
        }

        // Buy Link
        const aliLinkGenUrl = "http://localhost:" + config.portAliLinkGen + '/' + encodeURIComponent(extLink);
        const options = {
            json: true
        };
        request(aliLinkGenUrl, options, (err, linkResponse, linkAnswer) => {
            if (err) {
                err.status = 500;
                reject("Parser error: " + JSON.stringify(err));
            }
            
            if (linkResponse.statusCode === 200) {
                console.log(linkAnswer);
                resolve({'images': imageJSONs, 'title': title, 'buyLink': linkAnswer.link});
            } else {
                reject("Parser error" + JSON.stringify(linkAnswer));
            }
        });
    });
}

exports.hasAPI - false;
exports.parsePrice = function(extLink, page) {
    return new Promise(function(resolve, reject){
        let oldPriceObject = page.match(/window.runParams.minPrice=\"(.*?)\"/g)[0];
        let newPriceObject = page.match(/window.runParams.actMinPrice=\"(.*?)\"/g)[0];
        let currObject = page.match(/window.runParams.baseCurrencyCode=\"(.*?)\"/g)[0];
        resolve({
            priceString: newPriceObject + currObject,
            discString: oldPriceObject + currObject
        });
    });
};

/*
exports.parseImages = function (page, extLink){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        let hiResimageString = page.substring((page.indexOf("window.runParams.imageBigViewURL=[")+34), page.indexOf("];", page.indexOf("window.runParams.imageBigViewURL=[")));
        hiResimageString = hiResimageString.replace(/\n/g, '');
        hiResimageString = hiResimageString.replace(/\t/g, '');
        hiResimageString = hiResimageString.replace(/"/g, '');
        
        let hiResURLArray = hiResimageString.split(",");
        var $=cheerio.load(page);


        $('.img-thumb-item').each(function(i, elem) {
            let part = cheerio.load($(this).html());
            let imageJSON = {
                "hiRes": hiResURLArray[i],
                "thumb": part('img').attr('src')
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
        if(extLink.indexOf("item/")>=0){
        title = extLink.substring(extLink.indexOf("item/")+5, extLink.indexOf("/", extLink.indexOf("item/")+5));
        }

        if(extLink.indexOf("product/")>=0){
            title = extLink.substring(extLink.indexOf("product/")+8, extLink.indexOf("/", extLink.indexOf("product/")+8));
        }

        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};
*/
