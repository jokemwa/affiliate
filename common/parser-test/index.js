var saver = require('../../manager/routes/misc/saver');

let link = 'https://www.amazon.com/Microsoft-Surface-Precision-Mouse-Light/dp/B076KRHJ7B?SubscriptionId=AKIAJ4UAIYQ6B6R7FGZA&tag=electroni0310-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B076KRHJ7B';


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

