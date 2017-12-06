import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { ProductPreviewComponent } from '../../../products/childs/productPreview/productPreview.component';
import { SelectProductComponent } from '../../../products/childs/selectProduct/selectProduct.component';
import { EditProductComponent } from '../../../products/childs/editProduct/editProduct.component';

@Component({
  selector: 'app-view-tag-products',
  templateUrl: './viewTagProducts.component.html',
  styleUrls: [],
})

export class ViewTagProductsComponent implements OnInit {

  isDataReady = false;

  tag: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getTag(params.get('_id')))
    .subscribe(response => {
      this.tag = response;
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

  getTagData () {
    this.restService.getTag(this.tag._id).subscribe(
      response => {
          this.tag = response;
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

  removeProduct(product_id) {
    this.restService.removeProductFromTag(this.tag._id, product_id).subscribe(
      response => {
        this.getTagData();
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

  checkProducts (productsList) {
    return new Promise ((resolve, rejet) => {
      const checkedList = [];
      for (let i = 0; i < productsList.length; i++) {
        let isFound = false;
        for (let j = 0; j < this.tag.items.length; j++) {
          if (this.tag.items[j].product._id === productsList[i]._id) {
              isFound = true;
          }
        }
        if (isFound === false) {
          checkedList.push(productsList[i]);
        }
      }
      resolve(checkedList);
    });
  }

  selectProduct(e) {
    e.stopPropagation();
    e.preventDefault();
    this.restService.getProducts().subscribe(
      response => {
        this.checkProducts(response).then((productsList) => {
          const modalRef = this.modalService.open(SelectProductComponent, {size: 'lg'});
          modalRef.componentInstance.products = productsList;
          modalRef.result.then((product_id) => {
            this.restService.addProductToTag(this.tag._id, product_id).subscribe(
              resp => {
                this.getTagData();
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
            },
            () => {});
        });
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
        this.getTagData();
      },
      () => {}
    );
  }

}
