import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { ProductPreviewComponent } from '../../../products/childs/productPreview/productPreview.component';
import { DeleteProductComponent } from '../../../products/childs/deleteProduct/deleteProduct.component';
import { EditProductComponent } from '../../../products/childs/editProduct/editProduct.component';

@Component({
  selector: 'app-view-marketplace-products',
  templateUrl: './viewMarketplaceProducts.component.html',
  styleUrls: [],
})

export class VievMarketplaceProductsComponent implements OnInit {

  isDataReady = false;

  marketplace: any;


  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getMarketplaceProducts(params.get('_id')))
    .subscribe(response => {
      this.marketplace = response;
      this.isDataReady = true;
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
      window.alert(JSON.stringify(err));
      console.log(JSON.stringify(err));
      }
  });
  }

  getMarketplaceData () {
    this.restService.getMarketplaceProducts(this.marketplace._id).subscribe(
      response => {
          this.marketplace = response;
      },
      err => {
        if (err.status === 401 || err.status === 403) {
          this.restService.logout();
          this.router.navigate(['/login']);
        } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
        }
    });
  }


  deleteProduct(product_id) {
    const _this = this;
    const modalRef = this.modalService.open(DeleteProductComponent, {size: 'sm'});
    modalRef.componentInstance._id = product_id;
    modalRef.result.then(function(){
      _this.getMarketplaceData();
    }, function(){});
  }

  productPreview (e, product_id) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
    modalRef.componentInstance._id = product_id;
  }

  editProduct(_id: string) {
    const modalRef = this.modalService.open(EditProductComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getMarketplaceData();
      },
      () => {}
    );
  }

}
