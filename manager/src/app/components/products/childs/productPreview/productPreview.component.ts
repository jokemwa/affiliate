import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-product-preview',
  templateUrl: './productPreview.component.html',
  styleUrls: [],
})

export class ProductPreviewComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

  product: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct () {
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
      }
    );
  }

  clickClose () {
    this.activeModal.dismiss();
  }

  clickBuyButton () {
    window.open(this.product.buyLink, '_blank');
  }

}
