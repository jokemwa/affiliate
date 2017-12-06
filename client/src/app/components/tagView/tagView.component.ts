import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';


@Component({
  selector: 'app-tag-view',
  templateUrl: './tagView.component.html',
  styleUrls: []
})
export class TagViewComponent implements OnInit {

  tag: any;
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
            .switchMap((params: ParamMap) => this.restService.getTag(params.get('_id')))
            .subscribe(response => {
              if (!response) {
                this.router.navigate(['/']);
              }
              this.tag = response;
              this.tag.items = orderBy(this.tag.items, 'product.title', 'asc');
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
