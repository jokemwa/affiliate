import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component ({
  selector: 'app-product-list',
  templateUrl: './productList.component.html',
  styleUrls: []
})
export class ProductListComponent implements OnInit {

  @Input() items: any;
  @Output() onProductClick = new EventEmitter<string>();

  showed = 12;

    constructor() {}

    ngOnInit () {
    }

    onClick(product_promoLink) {
      this.onProductClick.emit(product_promoLink);
    }

    showMore (e) {
      e.stopPropagation();
      e.preventDefault();
      this.showed += 10;
    }

}
