// eBay parser
var secrets = require('../../_secrets');

var cheerio = require('cheerio');
var request = require('request');

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        // Images
        var imageJSONs = [];

        var imageString = page.substring((page.indexOf("'fsImgList':")+12), page.indexOf("});", page.indexOf("'fsImgList':")+12));
        imageString = imageString.replace(/\u002F/g, '/');
        var imageURLs = eval(imageString);
        //console.log(imageURLs);
        for (let i=0; i< imageURLs.length; i++){
            let imageJSON = {
                "hiRes": imageURLs[i].maxImageUrl,
                "thumb": imageURLs[i].thumbImgUrl
            };
            //console.log(imageJSON);
            imageJSONs.push(imageJSON);
        }

        if(imageJSONs.length == 0){
            reject("Parser error");
        }

        // Title
        let title = extLink.substring(extLink.indexOf("/itm/")+5, extLink.indexOf("/", extLink.indexOf("/itm/")+5));
        
        if(title.length == 0){
            reject("Parser error");
        }

        // Buy Link
        let buyLink;
        let product_id = extLink.substring(extLink.lastIndexOf("/")+1);
        if (product_id.indexOf('?') > 0) {
            product_id = product_id.substring(0, product_id.indexOf('?'));
        }
        let options = {
            uri: 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid='
            + secrets.EBAY.APP_KEY
            + '&siteid=0&version=967&ItemID='+ product_id
            + '&trackingid=' + secrets.EBAY.trackingId+ '&trackingpartnercode=' + secrets.EBAY.trackingPartnerCode,
            method:'GET',
        };
        request(options, function (err, result, response) {
            if (err) {
                reject(err);
            }
            let answer = JSON.parse(response);
            if (answer.Item.ViewItemURLForNaturalSearch) {
                buyLink = answer.Item.ViewItemURLForNaturalSearch;
                
                resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});
            } else {
                reject("Parser error. Couldn't get rover link");
            }
        });
    });
}

exports.parseImages = function (page, extLink){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var imageString = page.substring((page.indexOf("'fsImgList':")+12), page.indexOf("});", page.indexOf("'fsImgList':")+12));
        imageString = imageString.replace(/\u002F/g, '/');
        var imageURLs = eval(imageString);
        //console.log(imageURLs);
        for (let i=0; i< imageURLs.length; i++){
            let imageJSON = {
                "hiRes": imageURLs[i].maxImageUrl,
                "thumb": imageURLs[i].thumbImgUrl
            };
            //console.log(imageJSON);
            imageJSONs.push(imageJSON);
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

        title = extLink.substring(extLink.indexOf("/itm/")+5, extLink.indexOf("/", extLink.indexOf("/itm/")+5));
        
        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};

exports.parseBuyLink = function(extLink){
    return new Promise(function(resolve, reject){
        let product_id = extLink.substring(extLink.lastIndexOf("/")+1);
        if (product_id.indexOf('?') > 0) {
            product_id = product_id.substring(0, product_id.indexOf('?'));
        }
        let options = {
            uri: 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid='
            + secrets.EBAY_APP_KEY
            + '&siteid=0&version=967&ItemID='+ product_id
            + '&trackingid=' + trackingid+ '&trackingpartnercode=' + trackingpartnercode,
            method:'GET',
        };
        request(options, function (err, result, response) {
            if (err) {
                reject(err);
            }
            let answer = JSON.parse(response);
            if (answer.Item.ViewItemURLForNaturalSearch) {
                resolve(answer.Item.ViewItemURLForNaturalSearch);
            } else {
                reject("Parser error. Couldn't get rover link");
            }
        });
    });


};

exports.hasAPI - true;
exports.parsePrice = function(extLink) {
    return new Promise(function(resolve, reject){
        let product_id = extLink.substring(extLink.lastIndexOf("/")+1);
        if (product_id.indexOf('?') > 0) {
            product_id = product_id.substring(0, product_id.indexOf('?'));
        }
        let options = {
            uri: 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid='
            + secrets.EBAY.APP_KEY
            + '&siteid=0&version=967&ItemID='+ product_id
            + '&trackingid=' + secrets.EBAY.trackingId+ '&trackingpartnercode=' + secrets.EBAY.trackingPartnerCode,
            method:'GET',
        };
        request(options, function (err, result, response) {
            if (err) {
                reject(err);
            }
            let answer = JSON.parse(response);
            if (answer) {
                console.log(answer);
                resolve({
                    priceString: answer.Item.ConvertedCurrentPrice.Value + answer.Item.ConvertedCurrentPrice.CurrencyID,
                    discString: answer.Item.DiscountPriceInfo && answer.Item.DiscountPriceInfo.OriginalRetailPrice ? answer.Item.DiscountPriceInfo.OriginalRetailPrice.Value + answer.Item.DiscountPriceInfo.OriginalRetailPrice.CurrencyID : null
                });
            } else {
                reject("Parser error. Couldn't get rover link");
            }
        });
    });
}

