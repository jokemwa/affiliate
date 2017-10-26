// Amazon parser

var cheerio = require('cheerio');


exports.parseImages = function (page){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        if(page.indexOf("'colorImages': { ") < 0){
            reject('Amazon Robot Check. Try again later.');
        }

        var imageString = "{" + page.substring((page.indexOf("'colorImages': { ")+17), page.indexOf("}]},", page.indexOf("'colorImages': "))+3);
        imageString = imageString.replace(/'/g, '"');
        //console.log(imageString);
        var imageJSON = JSON.parse(imageString);

        
        imageJSON.initial.forEach(function(element) {
            imageJSONs.push(element);
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
        let title = '';

        let $=cheerio.load(page);

        title=$('span[id="productTitle"]').text();
        
        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};

