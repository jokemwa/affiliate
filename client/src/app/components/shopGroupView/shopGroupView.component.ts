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
  selector: 'app-shop-group-view',
  templateUrl: './shopGroupView.component.html',
  styleUrls: [],
})

export class ShopGroupViewComponent implements OnInit {

  apiUrl = Settings.apiUrl;

  shopGroup: any;
  isDataReady = false;
  translation: any;

  constructor(
    private restService: RESTService,
    private translationService: TranslationService,
    private trackingService: TrackingService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.restService.getShopGroup(params.get('_id')))
        .subscribe(response => {
          if (!response) {
            this.router.navigate(['/']);
          }
          this.shopGroup = response;
          this.shopGroup.items = orderBy(this.shopGroup.items, 'order', 'asc');
          this.isDataReady = true;
          const action = {
            action: 'load',
            area: {
              name: 'shopGroupView',
              context: {
                type: 'ShopGroup',
                value: this.shopGroup._id
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

  clickShop(e, _id: string) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'shopGroupView',
        context: {
          type: 'ShopGroup',
          value: this.shopGroup._id
        }
      },
      element: {
        name: 'shopsList',
        context: {
          type: 'Shop',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/shop/' + _id]);
  }

}
