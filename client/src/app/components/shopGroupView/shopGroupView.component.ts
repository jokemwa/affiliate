import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-shop-group-view',
  templateUrl: './shopGroupView.component.html',
  styleUrls: [],
})

export class ShopGroupViewComponent implements OnInit {

  shopGroup: any;
  isDataReady = false;
  translation: any;

  constructor(
    private restService: RESTService,
    private translationService: TranslationService,
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
    this.router.navigate(['/shop/' + _id]);
  }

}
