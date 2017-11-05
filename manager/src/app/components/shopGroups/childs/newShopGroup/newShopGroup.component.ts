import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-new-shop-group',
  templateUrl: './newShopGroup.component.html',
  styleUrls: [],
})

export class NewShopGroupComponent {

  shopGroup = {name: ''};

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  clickSave () {
    if (this.shopGroup.name !== undefined && this.shopGroup.name !== '') {
      this.restService.createShopGroup(this.shopGroup).subscribe(
        response => {
          this.activeModal.close('Created');
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
