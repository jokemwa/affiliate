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
  selector: 'app-brand-view',
  templateUrl: './brandView.component.html',
  styleUrls: []
})
export class BrandViewComponent implements OnInit {

  apiUrl = Settings.apiUrl;

  brand: any;
  isDataReady = false;
  translation: any;

  constructor(private restService: RESTService,
    private translationService: TranslationService,
    private trackingService: TrackingService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router) {}

    ngOnInit(): void {
      this.translation = this.translationService.translation;
            this.route.paramMap
            .switchMap((params: ParamMap) => this.restService.getBrand(params.get('_id')))
            .subscribe(response => {
              if (!response) {
                this.router.navigate(['/']);
              }
              this.brand = response;
              this.brand.items = orderBy(this.brand.items, 'order', 'asc');
              this.isDataReady = true;
              const action = {
                action: 'load',
                area: {
                  name: 'brandView',
                  context: {
                    type: 'Brand',
                    value: this.brand._id
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
          name: 'brandView',
          context: {
            type: 'Brand',
            value: this.brand._id
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
          name: 'brandView',
          context: {
            type: 'Brand',
            value: this.brand._id
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
