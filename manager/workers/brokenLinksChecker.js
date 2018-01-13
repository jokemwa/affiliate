var Products = require('../models/products');
var BrokenLinks = require('../models/brokenLinks');

var saver = require('../routes/misc/saver');

function addBrokenLink(product_id) {
    BrokenLinks.create({'product': product_id}, (err, result) => {
        if(err){
            console.log(err);
        }
        console.log(result);
    });
}

exports.checkProducts = function() {
    Products.find({})
    .populate('marketplace')
    .exec((err, result) => {
        if(err){
            console.log(err);
        }
        if(result) {
            let now = new Date();
            result.forEach(product => {
                if ((now - product.brokenLinkCheck) >= 24 * 3600 * 1000 ){
                    let parser = require(product.marketplace.parser);
                    saver.download(product.link)
                    .then(page => {
                        parser.parse(page, product.link)
                        .then(result => {
                            Products.findByIdAndUpdate(product._id, {
                                $set: {'brokenLinkCheck': now}
                            }, {
                                    new: true
                                }, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log(result._id + 'Broken link check: ' + reuslt.brokenLinkCheck);
                                });
                        },
                        err => {
                            console.log(err);
                            addBrokenLink(product._id);
                        })
                    },
                    err => {
                        console.log(err);
                        addBrokenLink(product._id);
                    });
                }
            });
        }
    });
}



