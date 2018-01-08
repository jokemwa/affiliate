// ShoeMetro parser

var cheerio = require('cheerio');

exports.parseImages = function (page){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $=cheerio.load(page);
        
        let parts = cheerio.load($('div[id=viewControls]').html());
        
        parts('.linkWrap').each(function(i, elem) {
            let part = cheerio.load($(this).html());
            let imageJSON = {
                        "hiRes": part('a').attr('href'),
                        "thumb": part('img').attr('src')
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
                let part = cheerio.load($('.brandName').html());
                title = part('span').text();
        

                if(title.length == 0){
                    reject("Parser error");
                }else{
                    resolve(title);
                }
    });
};

