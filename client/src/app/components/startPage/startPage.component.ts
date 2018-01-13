import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { RESTService } from '../../services/rest.service';
import { TrackingService } from '../../services/tracking.service';
import { TranslationService } from '../../services/translation.service';

import { Settings } from '../../settings';

@Component ({
  selector: 'app-start-page',
  templateUrl: './startPage.component.html',
  styleUrls: []
})
export class StartPageComponent implements OnInit {

  apiUrl = Settings.apiUrl;

  isDataReady = false;
  translation: any;

  tops: any;
  topCategories: any;
  message: any;

    constructor(
      private restService: RESTService,
      private translationService: TranslationService,
      private trackingService: TrackingService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.translation = this.translationService.translation;
      const action = {
        action: 'load',
        area: {
          name: 'startPage',
          context: {
            type: '',
            value: ''
          }
        },
        element: {
          name: '',
          context: {
            type: '',
            value: ''
          }
        }
      };
      this.trackingService.trackAction(action);
      const observables = [];
      observables.push(this.restService.getTopCategories());
      observables.push(this.restService.getTops());
      observables.push(this.restService.getMarketingMessage());
      Observable.forkJoin(observables).subscribe(
        response => {
          if (response[0]) {
            this.topCategories = response[0];
          } else {
            this.topCategories = {items: []};
          }
          if (response[1]) {
            this.tops = response[1];
          } else {
            this.tops = {items: []};
          }
          this.message = response[2];
          this.isDataReady = true;
        },
        err => {
          console.log(JSON.stringify(err));
          }
      );
    }

    topProductsShowProductDetail(product: any) {
      const action = {
        action: 'click',
        area: {
          name: 'startPage',
          context: {
            type: '',
            value: ''
          }
        },
        element: {
          name: 'topProductsList',
          context: {
            type: 'Product',
            value: product._id
          }
        }
      };
      this.trackingService.trackAction(action);
      this.router.navigate(['/product/' + product.promoLink]);
    }

    topProductsShowTagResults(tag_id: string) {
      const action = {
        action: 'click',
        area: {
          name: 'startPage',
          context: {
            type: '',
            value: ''
          }
        },
        element: {
          name: 'topProductsList',
          context: {
            type: 'Tag',
            value: tag_id
          }
        }
      };
      this.trackingService.trackAction(action);
      this.router.navigate(['/tag/' + tag_id]);
    }

    topCategoriesShowProductDetail(product: any) {
      const action = {
        action: 'click',
        area: {
          name: 'startPage',
          context: {
            type: '',
            value: ''
          }
        },
        element: {
          name: 'topCategoriesProductsList',
          context: {
            type: 'Product',
            value: product._id
          }
        }
      };
      this.trackingService.trackAction(action);
      this.router.navigate(['/product/' + product.promoLink]);
    }

    topCategoriesShowTagResults(tag_id: string) {
      const action = {
        action: 'click',
        area: {
          name: 'startPage',
          context: {
            type: '',
            value: ''
          }
        },
        element: {
          name: 'topCategoriesProductsList',
          context: {
            type: 'Tag',
            value: tag_id
          }
        }
      };
      this.trackingService.trackAction(action);
      this.router.navigate(['/tag/' + tag_id]);
    }

    browseAllCategory(e, category_id) {
      e.stopPropagation();
      e.preventDefault();
      const action = {
        action: 'click',
        area: {
          name: 'startPage',
          context: {
            type: '',
            value: ''
          }
        },
        element: {
          name: 'topCategoriesProductsList',
          context: {
            type: 'Category',
            value: category_id
          }
        }
      };
      this.trackingService.trackAction(action);
      this.router.navigate(['/category/' + category_id]);
    }

}
