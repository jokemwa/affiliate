import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';


@Component({
  selector: 'app-category-view',
  templateUrl: './categoryView.component.html',
  styleUrls: []
})
export class CategoryViewComponent implements OnInit {

  category: any;
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
            .switchMap((params: ParamMap) => this.restService.getCategory(params.get('_id')))
            .subscribe(response => {
              this.category = response;
              this.isDataReady = true;
            },
            err => {
              console.log(JSON.stringify(err));
              }
          );
        }

    showProductDetail(promoLink: string) {
      this.router.navigate(['/product/' + promoLink]);
    }

}
