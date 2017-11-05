import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { DeleteShopGroupComponent } from './childs/deleteShopGroup/deleteShopGroup.component';
import { NewShopGroupComponent } from './childs/newShopGroup/newShopGroup.component';
import { EditShopGroupComponent } from './childs/editShopGroup/editShopGroup.component';

@Component({
  selector: 'app-shopgroups',
  templateUrl: './shopGroups.component.html',
  styleUrls: [],
})

export class ShopGroupsComponent implements OnInit {

  shopGroups: any;

  isDataReady = false;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.getShopGroups();
  }

  getShopGroups() {
    this.restService.getShopGroups().subscribe(
      response => {
          this.shopGroups = response;
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

  newShopGroup(e) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(NewShopGroupComponent, {size: 'sm'});
    modalRef.result.then(
      () => {
        this.getShopGroups();
      },
      () => {}
    );
  }

  editShopGroup (_id) {
    const modalRef = this.modalService.open(EditShopGroupComponent, {size: 'sm'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getShopGroups();
      },
      () => {}
    );
  }


  deleteShopGroup (_id) {

    const modalRef = this.modalService.open(DeleteShopGroupComponent, {size: 'sm'});
    modalRef.componentInstance._id = _id;
      modalRef.result.then(
        () => {
          this.getShopGroups();
        },
        () => {}
      );
  }

  viewShopGroupShops(_id) {
    this.router.navigate(['/shopgroups/' + _id + '/shops']);
  }

}


