import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';

@Component({
  selector: 'app-select-category',
  templateUrl: './selectCategory.component.html',
  styleUrls: []
})
export class SelectCategoryComponent  implements OnInit {

  categories: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService) {

  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {

  }

  selectImage(id: String) {

  }

  cancel() {
    this.activeModal.dismiss();
  }

  viewMore(e) {
    e.preventDefault();
  }

}
