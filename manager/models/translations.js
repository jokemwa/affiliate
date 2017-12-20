var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var translationSchema = new Schema({
    lang: {
        type: String,
        unique: true
    },
    topNavigation: {
        logoTitle: {
            type: String,
            default: 'FutureBuy'
        },
        facebookLink: {
            type: String,
            default: 'http://facebook.com/'
        },
        youtubeLink: {
            type: String,
            default: 'http://youtube.com/'
        },
        searchGoButtion: {
            type: String,
            default: 'Go!'
        },
        searchboxPlaceholder: {
            type: String,
            default: 'Search for...'
        },
        selectTitle: {
            type: String,
            default: 'What are you searching for?'
        },
        couponsLink: {
            type: String,
            default: 'Coupons'
        },
        shopsLink: {
            type: String,
            default: 'Shops'
        },
        brandsLink: {
            type: String,
            default: 'Brands'
        },
        helpLink: {
            type: String,
            default: 'Help'
        },
        categoriesLink: {
            type: String,
            default: 'Categories'
        },
        homeLink: {
            type: String,
            default: 'Home'
        },
      },
      footer: {
        year: {
            type: String,
            default: '2017'
        },
        followUs: {
            type: String,
            default: 'Follow Us'
        },
        contactEmail: {
            type: String,
            default: 'contact@futurebuy.il'
        },
        subscribeLabel: {
            type: String,
            default: 'Our Newsletter'
        },
        subscribeFieldPlaceholder: {
            type: String,
            default: 'Your e-mail'
        },
        subscribeButton: {
            type: String,
            default: 'Subscribe!'
        }
      },
      subscribeResult: {
        success: {
            type: String,
            default: 'Thank you!'
        },
        alreadySubscribed: {
            type: String,
            default: 'You have already subscribed!'
        },
        closeButton: {
            type: String,
            default: 'Close'
        }
      },
      startPage: {
          topRated: {
            type: String,
            default: 'Top Rated Offers'
        },
          whatsNew: {
            type: String,
            default: 'What\'s New In '
        },
          browseAll: {
            type: String,
            default: 'Browse All..'
        },
      },
      productPreview: {
          viewMore: {
            type: String,
            default: 'View More'
        },
      },
      tagView: {
        tagResults: {
          type: String,
          default: 'Search results for tag:'
      },
    }

}, {
        timestamps: true
    }
);

var Translations = mongoose.model('Translation', translationSchema);

module.exports = Translations;