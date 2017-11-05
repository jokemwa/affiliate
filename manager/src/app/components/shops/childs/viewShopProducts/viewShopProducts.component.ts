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
  selector: 'app-view-shop-products',
  templateUrl: './viewShopProducts.component.html',
  styleUrls: [],
})

export class ViewShopProductsComponent implements OnInit {

  isDataReady = false;

  shop: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getShop(params.get('_id')))
    .subscribe(response => {
      this.shop = response;
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

  getShopData () {
    this.restService.getShop(this.shop._id).subscribe(
      response => {
          this.shop = response;
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

  moveUp (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isFirst(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.shop.items.length; i++) {
        if (this.shop.items[i]._id === _id) {
          currentOrder = this.shop.items[i].order;
          for (let j = 0; j < this.shop.items.length; j++) {
            if (this.shop.items[j].order === (currentOrder - 1)) {
              this.shop.items[j].order = currentOrder;
              break;
            }
          }
          this.shop.items[i].order--;
          break;
        }
      }

      this.shop.items = this.shop.items.slice();
    }
  }

  moveDown (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isLast(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.shop.items.length; i++) {
        if (this.shop.items[i]._id === _id) {
          currentOrder = this.shop.items[i].order;
          for (let j = 0; j < this.shop.items.length; j++) {
            if (this.shop.items[j].order === (currentOrder + 1)) {
              this.shop.items[j].order = currentOrder;
              break;
            }
          }
          this.shop.items[i].order++;
          break;
        }
      }

      this.shop.items = this.shop.items.slice();

    }
  }

  isLast (_id) {
    let maxOrder = this.shop.items[0].order;
    let maxId = this.shop.items[0]._id;
    for (let i = 0; i < this.shop.items.length; i++) {
      if (this.shop.items[i].order > maxOrder) {
        maxOrder = this.shop.items[i].order;
        maxId = this.shop.items[i]._id;
      }
    }
    if (maxId === _id) {
      return true;
    } else {
      return false;
    }
  }

  isFirst (_id) {
    let minId;
    for (let i = 0; i < this.shop.items.length; i++) {
      if (this.shop.items[i].order === 0) {
        minId = this.shop.items[i]._id;
        break;
      }
    }
    if (minId === _id) {
      return true;
    } else {
      return false;
    }
  }


  deleteProduct(product_id) {
    const modalRef = this.modalService.open(DeleteProductComponent, {size: 'sm'});
    modalRef.componentInstance._id = product_id;
    modalRef.result.then(() => {
      this.getShopData();
    }, () => {});
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
        this.getShopData();
      },
      () => {}
    );
  }

  saveChanges() {
    this.shop.items.forEach((element) => {
    });
    this.restService.updateShop(this.shop).subscribe(
      response => {
          this.router.navigate(['/shops']);
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

}
