import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';

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
            },
            err => {
              this.router.navigate(['/']);
              console.log(JSON.stringify(err));
              }
          );
        }

    showProductDetail(promoLink: string) {
      this.router.navigate(['/product/' + promoLink]);
    }

    showTagResults(tag_id: string) {
      this.router.navigate(['/tag/' + tag_id]);
    }

}
