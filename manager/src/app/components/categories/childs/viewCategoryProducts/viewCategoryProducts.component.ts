import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { ProductPreviewComponent } from '../../../productPreview/productPreview.component';
import { DeleteProductComponent } from '../../../products/childs/deleteProduct/deleteProduct.component';

@Component({
  selector: 'app-view-category-products',
  templateUrl: './viewCategoryProducts.component.html',
  styleUrls: [],
})

export class ViewCategoryProductsComponent implements OnInit {

  isDataReady = false;

  category: any;

  existedCategories: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getCategory(params.get('_id')))
    .subscribe(response => {
      this.category = response;
      this.getCategories();
    },
    err => {
      window.alert('Server error: ' + err);
      console.log(err);
  });
  }

  getCategoryData () {
    this.restService.getCategory(this.category._id).subscribe(
      response => {
          this.category = response;
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  getCategories () {
      this.restService.getCategories().subscribe(
        response => {
        this.existedCategories = response;
        this.isDataReady = true;
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  }

  moveUp (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isFirst(_id)) {
      console.log('first');
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.category.items.length; i++) {
        if (this.category.items[i]._id === _id) {
          currentOrder = this.category.items[i].order;
          console.log(currentOrder);
          for (let j = 0; j < this.category.items.length; j++) {
            if (this.category.items[j].order === (currentOrder - 1)) {
              console.log(this.category.items[j].order);
              this.category.items[j].order = currentOrder;
              break;
            }
          }
          this.category.items[i].order--;
          console.log(this.category.items[i].order);
          break;
        }
      }

      this.category.items = this.category.items.slice();
    }
  }

  moveDown (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isLast(_id)) {
      console.log('last');
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.category.items.length; i++) {
        if (this.category.items[i]._id === _id) {
          currentOrder = this.category.items[i].order;
          console.log(currentOrder);
          for (let j = 0; j < this.category.items.length; j++) {
            if (this.category.items[j].order === (currentOrder + 1)) {
              console.log(this.category.items[j].order);
              this.category.items[j].order = currentOrder;
              break;
            }
          }
          this.category.items[i].order++;
          console.log(this.category.items[i].order);
          break;
        }
      }

      this.category.items = this.category.items.slice();

    }
  }

  isLast (_id) {
    let maxOrder = this.category.items[0].order;
    let maxId = this.category.items[0]._id;
    for (let i = 0; i < this.category.items.length; i++) {
      if (this.category.items[i].order > maxOrder) {
        maxOrder = this.category.items[i].order;
        maxId = this.category.items[i]._id;
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
    for (let i = 0; i < this.category.items.length; i++) {
      if (this.category.items[i].order === 0) {
        minId = this.category.items[i]._id;
        break;
      }
    }
    if (minId === _id) {
      return true;
    } else {
      return false;
    }
  }

  moveTo (_id, newCategory_id) {
    this.restService.changeProductCategory(this.category._id, newCategory_id, _id).subscribe(
      response => {
      this.getCategoryData();
    },
    err => {
      window.alert(JSON.stringify(err));
      console.log(JSON.stringify(err));
    });
  }

  deleteProduct(product_id) {
    const _this = this;
    const modalRef = this.modalService.open(DeleteProductComponent, {size: 'sm'});
    modalRef.componentInstance._id = product_id;
    modalRef.result.then(function(){
      _this.getCategoryData();
    }, function(){});
  }

  productPreview (e, product_id) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
    modalRef.componentInstance._id = product_id;
  }

  saveChanges() {
    this.restService.updateCategory(this.category).subscribe(
      response => {
          this.router.navigate(['/categories']);
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

}
