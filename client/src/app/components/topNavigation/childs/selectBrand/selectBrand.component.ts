import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import { TranslationService } from '../../../../services/translation.service';
import { TrackingService } from '../../../../services/tracking.service';

import { Settings } from '../../../../settings';

@Component({
  selector: 'app-select-brand',
  templateUrl: './selectBrand.component.html',
  styleUrls: []
})
export class SelectBrandComponent  implements OnInit {

  apiUrl = Settings.apiUrl;

  translation: any;

  brands: any;

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
        name: 'selectBrand',
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
    this.brands.items = orderBy(this.brands.items, 'order', 'asc');
  }

  clickBrand(_id) {
    const action = {
      action: 'click',
      area: {
        name: 'selectBrand',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'brandLink',
        context: {
          type: 'Brand',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/brand/' + _id]);
    this.activeModal.close();
  }


  cancel() {
    const action = {
      action: 'click',
      area: {
        name: 'selectBrand',
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
