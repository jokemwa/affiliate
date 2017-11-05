import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { RESTService } from '../../services/rest.service';

import { DeleteProductComponent } from './childs/deleteProduct/deleteProduct.component';
import { AddProductComponent } from './childs/addProduct/addProduct.component';
import { EditProductComponent } from './childs/editProduct/editProduct.component';
import { ProductPreviewComponent } from './childs/productPreview/productPreview.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [],
})

export class ProductsComponent implements OnInit {

  isDataReady = false;
  products: any;

  order = ['title'];
  direction = ['asc'];
  dir = {
    title: 'asc',
    category: 'asc',
    brand: 'asc',
    shop: 'asc'
  };

  constructor(
    private restService: RESTService,
    public modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.restService.getProducts().subscribe(
      response => {
          this.products = response;
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

  sortBy(e, ord) {
    e.stopPropagation();
    e.preventDefault();
    switch (ord) {
      case 'title':
        if (this.order[0] === 'title') {
          if (this.dir.title === 'asc') {
            this.dir.title = 'desc';
          } else {
            this.dir.title = 'asc';
          }
        }
        this.order = ['title'];
        this.direction = [this.dir.title];

        this.dir.category = 'asc';
        this.dir.brand = 'asc';
        this.dir.shop = 'asc';
      break;

      case 'category':
      if (this.order[0] === 'category.name') {
        if (this.dir.category === 'asc') {
          this.dir.category = 'desc';
        } else {
          this.dir.category = 'asc';
        }
      }
      this.order = ['category.name', 'title'];
      this.direction = [this.dir.category, 'asc'];

      this.dir.title = 'asc';
      this.dir.brand = 'asc';
      this.dir.shop = 'asc';
      break;

      case 'brand':
      if (this.order[0] === 'brand.name') {
        if (this.dir.brand === 'asc') {
          this.dir.brand = 'desc';
        } else {
          this.dir.brand = 'asc';
        }
      }
      this.order = ['brand.name', 'title'];
      this.direction = [this.dir.brand, 'asc'];

      this.dir.category = 'asc';
      this.dir.title = 'asc';
      this.dir.shop = 'asc';
      break;

      case 'shop':
      if (this.order[0] === 'shop.name') {
        if (this.dir.shop === 'asc') {
          this.dir.shop = 'desc';
        } else {
          this.dir.shop = 'asc';
        }
      }
      this.order = ['shop.name', 'title'];
      this.direction = [this.dir.shop, 'asc'];

      this.dir.category = 'asc';
      this.dir.title = 'asc';
      this.dir.brand = 'asc';
      break;
    }
  }

  editProduct(_id: string) {
    const modalRef = this.modalService.open(EditProductComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getProducts();
      },
      () => {}
    );
  }

  addProduct(e) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(AddProductComponent, {size: 'lg'});
    modalRef.result.then(
      () => {
        this.getProducts();
      },
      () => {}
    );
  }

  deleteProduct(_id: string) {
    const modalRef = this.modalService.open(DeleteProductComponent, {size: 'sm'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getProducts();
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


}
