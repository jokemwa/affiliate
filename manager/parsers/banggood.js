// BangGood parser

var cheerio = require('cheerio');

exports.parseImages = function (page){
    return new Promise(function(resolve, reject){
        var imageJSONs = [];

        var $=cheerio.load(page);

        let part = cheerio.load($('.good_photo_min').html());
        part('a').each(function(i, elem) {
            var imageJSON = {
                "hiRes": $(this).attr('big'),
                "thumb": ""
            };
            let part2 = cheerio.load($(this).html());
            imageJSON.thumb = part2('img').attr('src');
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
        for(let i=extLink.length-1; i>=0; i--){
            if(extLink[i] == "/"){
                title = extLink.substring(i+1, extLink.indexOf(".html"));
                break;
            }
        }

        if(title.length == 0){
            reject("Parser error");
        }else{
            resolve(title);
        }
    });
};

