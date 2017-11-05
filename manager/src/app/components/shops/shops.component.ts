import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { DeleteShopComponent } from './childs/deleteShop/deleteShop.component';
import { EditShopComponent } from './childs/editShop/editShop.component';
import { AddShopComponent } from './childs/addShop/addShop.component';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: [],
})

export class ShopsComponent implements OnInit {

  isDataReady = false;

  shops: any;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getShops();
  }



  getShops() {
    this.restService.getShops().subscribe(
      response => {
          this.shops = response;
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

  newShop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/shops/add']);
  }

  viewShopProducts (_id) {
    this.router.navigate(['/shops/' + _id + '/products']);
  }

  editShop (_id) {
    this.router.navigate(['/shops/' + _id + '/edit']);
  }

  deleteShop (_id) {
    for (let i = 0; i < this.shops.length; i++) {
      if (this.shops[i]._id === _id) {
        if (this.shops[i].items.length === 0) {
          const modalRef = this.modalService.open(DeleteShopComponent, {size: 'sm'});
          modalRef.componentInstance._id = _id;
          modalRef.result.then(
            () => {
              this.getShops();
            },
            () => {}
          );
        } else {
          window.alert('Shop is not empty!');
        }
        break;
      }
    }
  }

}
