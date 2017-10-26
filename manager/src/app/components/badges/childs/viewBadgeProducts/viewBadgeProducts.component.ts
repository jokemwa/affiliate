import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { ProductPreviewComponent } from '../../../productPreview/productPreview.component';
import { SelectProductComponent } from '../../../products/childs/selectProduct/selectProduct.component';

@Component({
  selector: 'app-view-badge-products',
  templateUrl: './viewBadgeProducts.component.html',
  styleUrls: [],
})

export class ViewBadgeProductsComponent implements OnInit {

  isDataReady = false;

  badge: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getBadge(params.get('_id')))
    .subscribe(response => {
      this.badge = response;
      this.isDataReady = true;
    },
    err => {
      window.alert('Server error: ' + err);
      console.log(err);
  });
  }

  getBadgeData () {
    this.restService.getBadge(this.badge._id).subscribe(
      response => {
          this.badge = response;
          this.isDataReady = true;
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  removeProduct(product_id) {
    this.restService.removeBadgeFromProduct(product_id, this.badge._id).subscribe(
      response => {
        this.getBadgeData();
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  selectProduct(e) {
    e.stopPropagation();
    e.preventDefault();
    const __this = this;
    this.restService.getProducts().subscribe(
      response => {
        const modalRef = this.modalService.open(SelectProductComponent, {size: 'lg'});
        response.forEach(function(element, i){
          for (let j = 0; j < __this.badge.products.length; j++) {
            if (__this.badge.products[j]._id === element._id) {
              response.splice(i, 1);
              break;
            }
          }
        });
        modalRef.componentInstance.products = response;
        modalRef.result.then(function(product_id){
          __this.restService.addBadgeToProduct(product_id, __this.badge._id).subscribe(
            resp => {
              __this.getBadgeData();
            },
            err => {
              window.alert(JSON.stringify(err));
              console.log(JSON.stringify(err));
          });
          }, function(){});
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  addProduct(product_id) {
    this.restService.removeBadgeFromProduct(product_id, this.badge._id).subscribe(
      response => {
        this.getBadgeData();
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  productPreview (e, product_id) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
    modalRef.componentInstance._id = product_id;
  }

}
