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
  selector: 'app-view-brand-products',
  templateUrl: './viewBrandProducts.component.html',
  styleUrls: [],
})

export class ViewBrandProductsComponent implements OnInit {

  isDataReady = false;

  brand: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getBrand(params.get('_id')))
    .subscribe(response => {
      this.brand = response;
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

  getBrandData () {
    this.restService.getBrand(this.brand._id)
    .subscribe(response => {
      this.brand = response;
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

      for (let i = 0; i < this.brand.items.length; i++) {
        if (this.brand.items[i]._id === _id) {
          currentOrder = this.brand.items[i].order;
          for (let j = 0; j < this.brand.items.length; j++) {
            if (this.brand.items[j].order === (currentOrder - 1)) {
              this.brand.items[j].order = currentOrder;
              break;
            }
          }
          this.brand.items[i].order--;
          break;
        }
      }

      this.brand.items = this.brand.items.slice();
    }
  }

  moveDown (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isLast(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.brand.items.length; i++) {
        if (this.brand.items[i]._id === _id) {
          currentOrder = this.brand.items[i].order;
          for (let j = 0; j < this.brand.items.length; j++) {
            if (this.brand.items[j].order === (currentOrder + 1)) {
              this.brand.items[j].order = currentOrder;
              break;
            }
          }
          this.brand.items[i].order++;
          break;
        }
      }

      this.brand.items = this.brand.items.slice();

    }
  }

  isLast (_id) {
    let maxOrder = this.brand.items[0].order;
    let maxId = this.brand.items[0]._id;
    for (let i = 0; i < this.brand.items.length; i++) {
      if (this.brand.items[i].order > maxOrder) {
        maxOrder = this.brand.items[i].order;
        maxId = this.brand.items[i]._id;
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
    for (let i = 0; i < this.brand.items.length; i++) {
      if (this.brand.items[i].order === 0) {
        minId = this.brand.items[i]._id;
        break;
      }
    }
    if (minId === _id) {
      return true;
    } else {
      return false;
    }
  }


  removeProduct(product_id) {
    this.restService.removeProductFromBrand(this.brand._id, product_id).subscribe(
      response => {
        this.getBrandData();
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

  editProduct(_id: string) {
    const modalRef = this.modalService.open(EditProductComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getBrandData();
      },
      () => {}
    );
  }

  productPreview (e, product_id) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
    modalRef.componentInstance._id = product_id;
  }

  saveChanges() {
    this.restService.updateBrand(this.brand).subscribe(
      response => {
          this.router.navigate(['/brands']);
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
