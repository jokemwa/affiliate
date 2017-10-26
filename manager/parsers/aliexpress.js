// AliExpress parser

var cheerio = require('cheerio');

exports.parseImages = function (page){
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

