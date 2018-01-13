import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-view-session',
  templateUrl: './viewSession.component.html',
  styleUrls: [],
})

export class ViewSessionComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

  session: any;

  brands: any;
  categories: any;
  shops: any;
  shopGroups: any;
  products: any;
  tags: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  ngOnInit(): void {
      const observables = [];
      observables.push(this.restService.getSession(this._id));
      observables.push(this.restService.getBrands());
      observables.push(this.restService.getCategories());
      observables.push(this.restService.getShops());
      observables.push(this.restService.getShopGroups());
      observables.push(this.restService.getProducts());
      observables.push(this.restService.getTags());
      Observable.forkJoin(observables).subscribe(
        response => {
          this.session = response[0];
          this.brands = response[1];
          this.categories = response[2];
          this.shops = response[3];
          this.shopGroups = response[4];
          this.products = response[5];
          this.tags = response[6];
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
        }
      );
  }

  brandName(_id: string) {
    for (let i = 0; i < this.brands.length; i++) {
      if (this.brands[i]._id === _id) {
        return this.brands[i].name;
      }
    }
  }

  categoryName(_id: string) {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i]._id === _id) {
        return this.categories[i].name;
      }
    }
  }

  shopName(_id: string) {
    for (let i = 0; i < this.shops.length; i++) {
      if (this.shops[i]._id === _id) {
        return this.shops[i].name;
      }
    }
  }

  shopGroupName(_id: string) {
    for (let i = 0; i < this.shopGroups.length; i++) {
      if (this.shopGroups[i]._id === _id) {
        return this.shopGroups[i].name;
      }
    }
  }

  tagName(_id: string) {
    for (let i = 0; i < this.tags.length; i++) {
      if (this.tags[i]._id === _id) {
        return this.tags[i].name;
      }
    }
  }

  productName(_id: string) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i]._id === _id) {
        return this.products[i].title;
      }
    }
  }

  clickClose () {
    this.activeModal.dismiss();
  }

}
