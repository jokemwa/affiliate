import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import { RESTService } from '../../services/rest.service';

import { ProductPreviewComponent } from '../productPreview/productPreview.component';



@Component ({
  selector: 'app-start-page',
  templateUrl: './startPage.component.html',
  styleUrls: []
})
export class StartPageComponent implements OnInit {

  isDataLoaded = false;
  translation: any;

  topRated: any;
  topCategories: any;

  viewedLg = 4;


    constructor(
      private modalService: NgbModal,
      private restService: RESTService

    ) {}

    ngOnInit(): void {
      this.getTranslation();
      this.getTopRated();
      this.getTopCategories();
    }

    getTranslation() {
      this.restService.getTranslation().subscribe(
        response => {
            this.translation = response;
            this.isDataLoaded = true;
        },
        err => {
          console.log(JSON.stringify(err));
      });
    }

    showProductDetail(id: String) {
      const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
      modalRef.componentInstance.id = id;
    }

    getTopRated() {
      this.topRated = orderBy(this.restService.getTopRated(), 'order', 'desc');

    }

    getTopCategories() {
      this.topCategories = orderBy(this.restService.getTopCategories(), 'order', 'asc');
      for (let i = 0; i < this.topCategories.length; i++) {
        this.topCategories[i].products = orderBy(this.topCategories[i].products, 'order', 'asc');
        this.topCategories[i].viewIndexLg = -1;
        this.moveLeftTopCategories(i);
      }
    }



    moveLeftTopCategories(arrayId) {
      console.log(arrayId);

      if (this.topCategories[arrayId].viewIndexLg <= (this.topCategories[arrayId].products.length - this.viewedLg - 1) ) {
        this.topCategories[arrayId].viewIndexLg++;
      }

        for (let j = 0; j < this.topCategories[arrayId].products.length; j++) {

          if (j >= this.topCategories[arrayId].viewIndexLg &&
             j < this.topCategories[arrayId].viewIndexLg + this.viewedLg) {

            this.topCategories[arrayId].products[j].viewClassLg = 'd-sm-block';
          } else {

            this.topCategories[arrayId].products[j].viewClassLg = 'd-sm-none';
          }
          console.log(j, this.topCategories[arrayId].products[j].viewClassLg);

        }

    }

    moveRightTopCategories(arrayId) {
      console.log(arrayId);

      if (this.topCategories[arrayId].viewIndexLg >= 1 ) {
        this.topCategories[arrayId].viewIndexLg--;
      }


        for (let j = 0; j < this.topCategories[arrayId].products.length; j++) {

          if (j >= this.topCategories[arrayId].viewIndexLg &&
            j < this.topCategories[arrayId].viewIndexLg + this.viewedLg) {

              this.topCategories[arrayId].products[j].viewClassLg = 'd-sm-block';
            } else {

              this.topCategories[arrayId].products[j].viewClassLg = 'd-sm-none';
            }
            console.log(j, this.topCategories[arrayId].products[j].viewClassLg);

        }
    }

}
