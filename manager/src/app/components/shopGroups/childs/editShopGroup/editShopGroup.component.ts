import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-edit-shop-group',
  templateUrl: './editShopGroup.component.html',
  styleUrls: [],
})

export class EditShopGroupComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

  shopGroup: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  ngOnInit(): void {
    this.getShopGroupData();
  }

  getShopGroupData () {
    this.restService.getShopGroup(this._id).subscribe(
      response => {
          this.shopGroup = response;
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

  clickSave () {
    if (this.shopGroup.name !== undefined && this.shopGroup.name !== '') {
      this.restService.updateShopGroup(this.shopGroup).subscribe(
        response => {
          this.activeModal.close('Updated');
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
    } else {
      window.alert('Shop Group Name is empty!');
    }
  }

  clickCancel () {
    this.activeModal.dismiss();
  }

}
