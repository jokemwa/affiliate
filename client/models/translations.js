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
            default: 'JerusalemBuy'
        },
        facebookLink: {
            type: String,
            default: 'https://www.facebook.com/groups/1592170434330768/about/'
        },
        youtubeLink: {
            type: String,
            default: 'http://youtube.com/'
        },
        searchGoButtion: {
            type: String,
            default: 'חיפוש'
        },
        searchboxPlaceholder: {
            type: String,
            default: 'התחל להקליד'
        },
        searchboxDropdown: {
            inProducts: {
                type: String,
                default: 'במוצרים'
            },
            inCategories: {
                type: String,
                default: 'קטגוריות'
            },
            inBrands: {
                type: String,
                default: 'במותגים'
            },
            inShops: {
                type: String,
                default: 'בחנויות'
            }
        },
        selectTitle: {
            type: String,
            default: 'מה אתה מחפש?'
        },
        couponsLink: {
            type: String,
            default: 'לקבלת קופון'
        },
        shopsLink: {
            type: String,
            default: 'חנויות'
        },
        brandsLink: {
            type: String,
            default: 'מותגים'
        },
        helpLink: {
            type: String,
            default: 'לקבלת עזרה'
        },
        categoriesLink: {
            type: String,
            default: 'קטגוריות'
        },
        homeLink: {
            type: String,
            default: 'דף הבית'
        },
      },
      footer: {
        year: {
            type: String,
            default: '2017-2018'
        },
        followUs: {
            type: String,
            default: 'עקבו אחרינו'
        },
        contactEmail: {
            type: String,
            default: '‫jerus.city@gmail.com'
        },
        subscribeLabel: {
            type: String,
            default: 'הניוזלטר שלנו'
        },
        subscribeFieldPlaceholder: {
            type: String,
            default: 'האימייל שלך'
        },
        subscribeButton: {
            type: String,
            default: 'הירשם!'
        },
        terms: {
            type: String,
            default: 'תנאי שימוש ומדיניות פרטיות'
        }
      },
      subscribeResult: {
        success: {
            type: String,
            default: 'תודה!'
        },
        alreadySubscribed: {
            type: String,
            default: 'כבר נרשמת!'
        },
        closeButton: {
            type: String,
            default: 'סיום'
        },
    },
      startPage: {
          topRated: {
            type: String,
            default: 'הצעות מובילות'
        },
          whatsNew: {
            type: String,
            default: 'מה חדש'
        },
          browseAll: {
            type: String,
            default: 'פתח את כל ההצעות'
        },
      },
    productPreview: {
          viewMore: {
            type: String,
            default: 'הראה עוד הצעות'
        },
    },
    tagView: {
        tagResults: {
            type: String,
            default: 'תוצאות חיפוש עבור תווית:'
        }
    },
    searchView: {
        searchResults: {
            type: String,
            default: 'תוצאות חיפוש עבור:'
        },
        productsResults: {
            type: String,
            default: 'מוצרים'
        },
        numberOfResults: {
            type: String,
            default: 'תוצאות'
        }
    },
    productView: {
        buyButton: {
          type: String,
          default: 'לרכישה'
        },
        interestedIn: {
            type: String,
            default: 'אתה עשוי להתעניין גם ב:'
        },
        priceAround: {
            type: String,
            default: 'בערך'
        },
        gettingPrice: {
            type: String,
            default: 'מקבל מחיר'
        }
    }

}, {
        timestamps: true
    }
);

var Translations = mongoose.model('Translation', translationSchema);

module.exports = Translations;