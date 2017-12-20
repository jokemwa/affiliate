import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { RESTService } from '../../services/rest.service';
import { TrackingService } from '../../services/tracking.service';
import { TranslationService } from '../../services/translation.service';

import { ProductPreviewComponent } from '../products/productPreview/productPreview.component';



@Component ({
  selector: 'app-start-page',
  templateUrl: './startPage.component.html',
  styleUrls: []
})
export class StartPageComponent implements OnInit, AfterViewInit {

  isDataReady = false;
  translation: any;

  tops: any;
  topCategories: any;
  message: any;

    constructor(
      private modalService: NgbModal,
      private restService: RESTService,
      private translationService: TranslationService,
      private trackingService: TrackingService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.translation = this.translationService.translation;
      const observables = [];
      observables.push(this.restService.getTopCategories());
      observables.push(this.restService.getTops());
      observables.push(this.restService.getMarketingMessage());
      Observable.forkJoin(observables).subscribe(
        response => {
          if (response[0]) {
            this.topCategories = response[0];
          } else {
            this.topCategories = {items: []};
          }
          if (response[1]) {
            this.tops = response[1];
          } else {
            this.tops = {items: []};
          }
          this.message = response[2];
          this.isDataReady = true;
        },
        err => {
          console.log(JSON.stringify(err));
          }
      );
    }

    ngAfterViewInit(): void {
      this.trackingService.trackAction('startPage', 'Loaded', '');
    }

    showProductDetail(id: string) {
      const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
      modalRef.componentInstance.id = id;
    }

    showTagResults(tag_id: string) {
      this.router.navigate(['/tag/' + tag_id]);
    }

    browseAllCategory(e, category_id) {
      e.stopPropagation();
      e.preventDefault();
      this.router.navigate(['/category/' + category_id]);
    }

}
