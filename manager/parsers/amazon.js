// Amazon parser
var amazon = require('amazon-product-api');

var saver = require('../routes/misc/saver');

var secrets = require('../_secrets');

function cutProductId(extLink) {
    let product_id = '';
    if (extLink.indexOf('?') > 0) {
        product_id = extLink.substring(0, extLink.indexOf('?'));
    }
    if (product_id.indexOf('/ref=') > 0) {
        product_id = product_id.substring(0, product_id.indexOf('/ref='));
    }
    if (product_id[product_id.length - 1] === '/') {
        product_id = product_id.substring(0, product_id.length - 1);
    }
    product_id = product_id.substring(product_id.lastIndexOf('/') + 1);
    console.log(product_id);
    return product_id;
}

function getApiEndpoint (extLink) {
    let domain = saver.cutLink(extLink);
    if (domain.indexOf('.com') >= 0) return {'url': 'webservices.amazon.com', 'assocTag': secrets.AMAZON.assocTag.com};
    if (domain.indexOf('.co.uk') >= 0) return {'url': 'webservices.amazon.co.uk', 'assocTag': secrets.AMAZON.assocTag.uk};
    if (domain.indexOf('.fr') >= 0) return {'url': 'webservices.amazon.fr', 'assocTag': secrets.AMAZON.assocTag.fr};
    if (domain.indexOf('.de') >= 0) return {'url': 'webservices.amazon.de', 'assocTag': secrets.AMAZON.assocTag.de};
    if (domain.indexOf('.it') >= 0) return {'url': 'webservices.amazon.it', 'assocTag': secrets.AMAZON.assocTag.it};
    if (domain.indexOf('.es') >= 0) return {'url': 'webservices.amazon.es', 'assocTag': secrets.AMAZON.assocTag.es};
    return null;
}

exports.parse = function (page, extLink){
    return new Promise(function(resolve, reject){
        var endpoint = getApiEndpoint(extLink);
        if (endpoint === null) reject('Wrong link');

        var client = amazon.createClient({
            awsId: secrets.AMAZON.ACCESS_KEY,
            awsSecret: secrets.AMAZON.SECRET_KEY,
            awsTag: endpoint.assocTag
        });

        let product_id = cutProductId(extLink);

        client.itemLookup({
            itemId: product_id,
            responseGroup: 'ItemAttributes,Images',
            domain: endpoint.url
          }, function(err, results, response) {
            if (err) {
                console.log(JSON.stringify(err));
                reject(err);
            } else {
                // Images
                var imageJSONs = [];
                if (results[0].ImageSets) {
                    for (let i = 0; i < results[0].ImageSets[0].ImageSet.length; i++) {

                        let imageJSON = {
                            "hiRes": '',
                            "thumb": ''
                        }; 
        
                        if(results[0].ImageSets[0].ImageSet[i].HiResImage) {
                            imageJSON.hiRes = results[0].ImageSets[0].ImageSet[i].HiResImage[0].URL[0];
                        } else {
                            if(results[0].ImageSets[0].ImageSet[i].LargeImage) {
                                imageJSON.hiRes = results[0].ImageSets[0].ImageSet[i].LargeImage[0].URL[0];
                            } else {
                                reject('Parser error');
                            }
                        }
        
                        if(results[0].ImageSets[0].ImageSet[i].ThumbnailImage) {
                            imageJSON.thumb = results[0].ImageSets[0].ImageSet[i].ThumbnailImage[0].URL[0];
                        } else {
                            reject('Parser error');
                        }
        
                        imageJSONs.push(imageJSON);
                    }
                } else {
                    reject('Images unavailable');
                }


                // Title
                let title;
                if(results[0].ItemAttributes[0].Title){
                    title = results[0].ItemAttributes[0].Title[0];
                } else {
                    reject('Parser error');
                }
                

                // Buy Link
                let buyLink;
                if(results[0].DetailPageURL){
                    buyLink = results[0].DetailPageURL[0];
                } else {
                    reject('Parser error');
                }

                resolve({'images': imageJSONs, 'title': title, 'buyLink': buyLink});
            }
        });
    });
}

exports.hasAPI - true;
exports.parsePrice = function (extLink){
    return new Promise(function(resolve, reject){
        var endpoint = getApiEndpoint(extLink);
        if (endpoint === null) reject('Wrong link');

        var client = amazon.createClient({
            awsId: secrets.AMAZON.ACCESS_KEY,
            awsSecret: secrets.AMAZON.SECRET_KEY,
            awsTag: endpoint.assocTag
        });

        let product_id = cutProductId(extLink);

        client.itemLookup({
            itemId: product_id,
            responseGroup: 'ItemAttributes,OfferSummary',
            domain: endpoint.url
          }, function(err, results, response) {
            if (err) {
                reject(err);
            } else {
                let priceString;
                if (results[0].OfferSummary[0].LowestNewPrice) {
                    //console.log(results[0]);
                    priceString = results[0].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
                }
                let discString;
                if (results[0].ItemAttributes[0].ListPrice) {
                    discString = results[0].ItemAttributes[0].ListPrice[0].FormattedPrice[0];
                }
                if (discString === priceString) discString = undefined;
                resolve({
                    priceString: priceString,
                    discString: discString
                });
            }
        });
    });
}
