import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Settings } from '../../../settings';

@Component ({
  selector: 'app-product-list',
  templateUrl: './productList.component.html',
  styleUrls: ['./productList.component.css']
})
export class ProductListComponent implements OnInit {

  apiUrl = Settings.apiUrl;

  @Input() items: any;
  @Output() onProductClick = new EventEmitter<any>();
  @Output() onTagClick = new EventEmitter<string>();

  showed = 12;

    constructor() {}

    ngOnInit () {
    }

    onClickProduct(promoLink, _id) {
      this.onProductClick.emit({promoLink: promoLink, _id: _id});
    }

    onClickTag(e, tag_id) {
      e.stopPropagation();
      e.preventDefault();
      this.onTagClick.emit(tag_id);
    }

    showMore (e) {
      e.stopPropagation();
      e.preventDefault();
      this.showed += 10;
    }

}
