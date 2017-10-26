import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';


import { RESTService } from '../../services/rest.service';


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
    private restService: RESTService) {}

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
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  clickClose () {
    this.activeModal.dismiss();
  }

}
