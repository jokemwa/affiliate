import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import { TranslationService } from '../../../../services/translation.service';

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
    private router: Router) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;
    this.brands.items = orderBy(this.brands.items, 'order', 'asc');
  }

  clickBrand(_id) {
    this.router.navigate(['/brand/' + _id]);
    this.activeModal.close();
  }


  cancel() {
    this.activeModal.dismiss();
  }

}
