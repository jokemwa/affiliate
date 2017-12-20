import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import { TranslationService } from '../../../../services/translation.service';

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
    private router: Router) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;
    this.shopGroups = orderBy(this.shopGroups, 'name', 'asc');
  }

  clickShopGroup(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/shop-group/' + _id]);
    this.activeModal.close();
  }


  cancel() {
    this.activeModal.dismiss();
  }

}
