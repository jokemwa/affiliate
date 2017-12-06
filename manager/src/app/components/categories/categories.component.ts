import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { DeleteCategoryComponent } from './childs/deleteCategory/deleteCategory.component';
import { EditCategoryComponent } from './childs/editCategory/editCategory.component';
import { NewCategoryComponent } from './childs/newCategory/newCategory.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: [],
})

export class CategoriesComponent implements OnInit {

  isDataReady = false;

  categories: any;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }



  getCategories() {
    this.restService.getCategories().subscribe(
      response => {
          this.categories = response;
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

  newCategory(e) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(NewCategoryComponent, {size: 'lg'});
    modalRef.result.then(
      () => {
        this.getCategories();
      },
      () => {}
    );
  }

  viewCategoryProducts (_id) {
    this.router.navigate(['/category/' + _id]);
  }

  editCategory (_id) {
    const modalRef = this.modalService.open(EditCategoryComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getCategories();
      },
      () => {}
    );
  }

  deleteCategory (_id: String) {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i]._id === _id) {
        if (this.categories[i].items.length === 0) {
          const modalRef = this.modalService.open(DeleteCategoryComponent, {size: 'sm'});
          modalRef.componentInstance._id = _id;
          modalRef.result.then(
            () => {
              this.getCategories();
            },
            () => {}
          );
        } else {
          window.alert('Category is not empty!');
        }
        break;
      }
    }
  }

}
