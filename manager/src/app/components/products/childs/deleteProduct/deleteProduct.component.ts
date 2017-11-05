import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-delete-product',
  templateUrl: './deleteProduct.component.html',
  styleUrls: [],
})

export class DeleteProductComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

  product: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  ngOnInit(): void {
    this.getProductData();
  }

  getProductData () {
    this.restService.getProduct(this._id).subscribe(
      response => {
          this.product = response;
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

  clickOk () {
    this.restService.deleteProduct(this._id).subscribe(
      response => {
        this.activeModal.close('Deleted');
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

  clickCancel () {
    this.activeModal.dismiss();
  }

}
