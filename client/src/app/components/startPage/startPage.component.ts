import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { RESTService } from '../../services/rest.service';

import { TrackingService } from '../../services/tracking.service';

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

  viewedLg = 4;


    constructor(
      private modalService: NgbModal,
      private restService: RESTService,
      private trackingService: TrackingService,
      private router: Router
    ) {}

    ngOnInit(): void {
      const observables = [];
      observables.push(this.restService.getTranslation());
      observables.push(this.restService.getTopCategories());
      observables.push(this.restService.getTops());
      Observable.forkJoin(observables).subscribe(
        response => {
          this.translation = response[0];
          this.topCategories = response[1];
          this.tops = response[2];
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

    browseAllCategory(e, category_id) {
      e.stopPropagation();
      e.preventDefault();
    }

}
