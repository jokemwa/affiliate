import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import { TranslationService } from '../../../../services/translation.service';
import { TrackingService } from '../../../../services/tracking.service';


@Component({
  selector: 'app-select-shop-group',
  templateUrl: './selectShopGroup.component.html',
  styleUrls: []
})
export class SelectShopGroupComponent  implements OnInit {

  translation: any;

  shopGroups: any;

  constructor(
    public activeModal: NgbActiveModal,
    private translationService: TranslationService,
    private trackingService: TrackingService,
    private router: Router) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;
    const action = {
      action: 'load',
      area: {
        name: 'selectShopGroup',
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
    this.shopGroups = orderBy(this.shopGroups, 'name', 'asc');
  }

  clickShopGroup(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'selectShopGroup',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'shopGroupLink',
        context: {
          type: 'ShopGroup',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/shop-group/' + _id]);
    this.activeModal.close();
  }


  cancel() {
    const action = {
      action: 'click',
      area: {
        name: 'selectShopGroup',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'cancel',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    this.activeModal.dismiss();
  }

}
