import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';


import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-select-shop',
  templateUrl: './selectShop.component.html',
  styleUrls: [],
})

export class SelectShopComponent implements OnInit {


  @Input() shops;

  searchText: string;

  searchResults = [];

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService) {}

  ngOnInit(): void {
    this.searchResults = this.shops;
  }

  search () {
    this.searchResults = [];
    for (let i = 0; i < this.shops.length; i++) {
      const element = this.shops[i].name.toLowerCase();
      if (element.indexOf(this.searchText.toLowerCase()) >= 0) {
        this.searchResults.push(this.shops[i]);
      }
    }
    this.searchResults = this.searchResults.slice();
  }

  selectShop(e, shop_id) {
    e.stopPropagation();
    e.preventDefault();
    this.activeModal.close(shop_id);
  }

  clickCancel () {
    this.activeModal.dismiss();
  }

}
