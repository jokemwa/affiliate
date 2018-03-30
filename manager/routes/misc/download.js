var request = require('request');
var fs = require('fs');

var url = 'https://www.365games.co.uk/ps4-games/monster-hunter-world-ps4-game';

var http1 = request({
    uri: url,
    method:'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    }
});

http1.on("error", function(err){
    console.log(err);
});

http1.pipe(fs.createWriteStream("./tmp/page.html"))
.on("error", function(err){
    console.log(err);
})
.once("close", function(){
    console.log('done');
});