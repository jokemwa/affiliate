import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-brand-view',
  templateUrl: './brandView.component.html',
  styleUrls: []
})
export class BrandViewComponent implements OnInit {

  brand: any;
  isDataReady = false;
  translation: any;

  constructor(
    private restService: RESTService,
    private translationService: TranslationService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router) {}

    ngOnInit(): void {
      this.translation = this.translationService.translation;
            this.route.paramMap
            .switchMap((params: ParamMap) => this.restService.getBrand(params.get('_id')))
            .subscribe(response => {
              this.brand = response;
              this.isDataReady = true;
            },
            err => {
              console.log(JSON.stringify(err));
              }
          );
        }

}
