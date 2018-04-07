var saver = require('../../manager/routes/misc/saver');

//let link = 'https://ru.aliexpress.com/item/-/32850010178.html?spm=a2g01.11225407.wjdlffivo8lhucw.21.2f8b6bc7AOsndm&scm=1007.16233.92930.0&scm-url=1007.16233.92930.0&pvid=9f46ab2d-bdfa-4a01-b100-8ec9a85ad598';
let link = 'https://ru.aliexpress.com/item/15-6inch-Intel-Core-i7-CPU-8GB-RAM-240GB-SSD-1TB-HDD-Built-in-WIFI-Bluetooth/32813013928.html';

saver.download(link)
.then(page => {
    console.log(page);
    const parser = require('../../manager/parsers/aliexpress');
    parser.parse(page, link)
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

