// eBay parser

var cheerio = require('cheerio');

exports.parseImages = function (page){
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

