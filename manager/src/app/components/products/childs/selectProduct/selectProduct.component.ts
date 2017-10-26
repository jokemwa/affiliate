import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';


import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-select-product',
  templateUrl: './selectProduct.component.html',
  styleUrls: [],
})

export class SelectProductComponent implements OnInit {


  @Input() products;

  searchText: string;

  searchResults = [];

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService) {}

  ngOnInit(): void {
    this.searchResults = this.products;
  }

  search () {
    this.searchResults = [];
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].title.indexOf(this.searchText) >= 0) {
        console.log(this.products[i].title);
        this.searchResults.push(this.products[i]);
      }
    }
    this.searchResults = this.searchResults.slice();
  }

  selectProduct(e, product_id) {
    e.stopPropagation();
    e.preventDefault();
    this.activeModal.close(product_id);
  }

  clickCancel () {
    this.activeModal.dismiss();
  }

}
