import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';
import { TrackingService } from '../../services/tracking.service';

import { Settings } from '../../settings';

@Component({
  selector: 'app-shop-view',
  templateUrl: './shopView.component.html',
  styleUrls: []
})
export class ShopViewComponent implements OnInit {

  apiUrl = Settings.apiUrl;

  shop: any;
  isDataReady = false;
  translation: any;

  constructor(private restService: RESTService,
    private translationService: TranslationService,
    private location: Location,
    private route: ActivatedRoute,
    private trackingService: TrackingService,
    private router: Router) {}

    ngOnInit(): void {
      this.translation = this.translationService.translation;
            this.route.paramMap
            .switchMap((params: ParamMap) => this.restService.getShop(params.get('_id')))
            .subscribe(response => {
              if (!response) {
                this.router.navigate(['/']);
              }
              this.shop = response;
              this.shop.items = orderBy(this.shop.items, 'order', 'asc');
              this.isDataReady = true;
              const action = {
                action: 'load',
                area: {
                  name: 'shopView',
                  context: {
                    type: 'Shop',
                    value: this.shop._id
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
            },
            err => {
              this.router.navigate(['/']);
              console.log(JSON.stringify(err));
              }
          );
        }

        showProductDetail(product: any) {
          const action = {
            action: 'click',
            area: {
              name: 'shopView',
              context: {
                type: 'Shop',
                value: this.shop._id
              }
            },
            element: {
              name: 'productsList',
              context: {
                type: 'Product',
                value: product._id
              }
            }
          };
          this.trackingService.trackAction(action);
          this.router.navigate(['/product/' + product.promoLink]);
        }

        showTagResults(tag_id: string) {
          const action = {
            action: 'click',
            area: {
              name: 'shopView',
              context: {
                type: 'Shop',
                value: this.shop._id
              }
            },
            element: {
              name: 'productsList',
              context: {
                type: 'Tag',
                value: tag_id
              }
            }
          };
          this.trackingService.trackAction(action);
          this.router.navigate(['/tag/' + tag_id]);
        }

}
