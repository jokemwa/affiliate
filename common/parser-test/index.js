var saver = require('../../manager/routes/misc/saver');

let link = 'https://www.gearbest.com/tablet-pcs/pp_719209.html?utm_source=aw&affi_id=460206&awc=6607_1522404823_a8b0f276515927f808cb9dba92634ddf';


saver.download(link)
.then(page => {
    console.log(page);
    const parser = require('../../manager/parsers/gearbest');
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

