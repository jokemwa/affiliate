var saver = require('../../manager/routes/misc/saver');

//let link = 'https://ru.aliexpress.com/item/-/32850010178.html?spm=a2g01.11225407.wjdlffivo8lhucw.21.2f8b6bc7AOsndm&scm=1007.16233.92930.0&scm-url=1007.16233.92930.0&pvid=9f46ab2d-bdfa-4a01-b100-8ec9a85ad598';
let link = 'https://www.amazon.com/Sennheiser-HD-4-40-Headphones-BT/dp/B01MSZSJE9?psc=1&SubscriptionId=AKIAJ4UAIYQ6B6R7FGZA&tag=electroni0310-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B01MSZSJE9';

saver.download(link)
.then(page => {
    console.log(page);
    const parser = require('../../manager/parsers/amazon');
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

