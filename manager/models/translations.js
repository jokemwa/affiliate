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
        suggestionsLink: {
            type: String,
            default: 'Suggestions'
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
      }

}, {
        timestamps: true
    }
);

var Translations = mongoose.model('Translation', translationSchema);

module.exports = Translations;