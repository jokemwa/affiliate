var saver = require('../../manager/routes/misc/saver');

let link = 'https://www.iwantoneofthose.com/gift-travel/light-up-globe/11716058.html?widget_id=932419';

saver.download(link)
.then(page => {
    //console.log(page);
    const parser = require('../../manager/parsers/iwoot');
    parser.parsePrice(link, page)
    .then(result => {
        console.log(result);
        /*let price = parseFloat(result.match(/[-]?[0-9]+([.]?[,]?[0-9]+)?/gi)[0].replace(/,/g, '.'), 10);
        let curr = '';
        if (result.match(/£/gi)) curr = 'gbp';
        if (result.match(/€/gi)) curr = 'eur';
        if (result.match(/\$/gi)) curr = 'usd';
        
        console.log(price);
        console.log(curr);*/
    })
    .catch(err => console.log(err));
})
.catch(err => console.log(err));

