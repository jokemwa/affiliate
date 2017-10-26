import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

@Component({
  selector: 'app-product-preview',
  templateUrl: './productPreview.component.html',
  styleUrls: []
})
export class ProductPreviewComponent  implements OnInit {

  @Input() id;

  product: any;

  activeImage: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService) {

  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.product = this.restService.getProductPreview(this.id);
    this.activeImage = this.product.frontImage;
  }

  selectImage(id: String) {
    this.activeImage = id;
  }

  cancel() {
    this.activeModal.dismiss();
  }

  viewMore(e) {
    e.preventDefault();
  }

}
