import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { orderBy } from 'lodash';


@Component ({
  selector: 'app-product-carousel',
  templateUrl: './productCarousel.component.html',
  styleUrls: []
})
export class ProductCarouselComponent implements OnInit {

  @Input() items: any;
  @Output() onProductClick = new EventEmitter<string>();

  viewIndex = {
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  };

  viewSize = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4
  };

    constructor() {}

    ngOnInit () {
      this.items = orderBy(this.items, 'order', 'asc');
      for (let i = 0; i < this.items.length; i++) {
        if (i >= this.viewIndex.xl && i < (this.viewIndex.xl + this.viewSize.xl)) {
          this.items[i].xl = 'd-xl-block';
        } else {
          this.items[i].xl = 'd-xl-none';
        }
      }
    }

    ableToLeftXl() {
      if (this.viewIndex.xl <= (this.items.length - this.viewSize.xl - 1)) {
        return true;
      } else {
        return false;
      }
    }

    moveLeft(e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.ableToLeftXl()) {
        this.viewIndex.xl++;
      }
      for (let i = 0; i < this.items.length; i++) {
        if (i >= this.viewIndex.xl && i < (this.viewIndex.xl + this.viewSize.xl)) {
          this.items[i].xl = 'd-xl-block';
        } else {
          this.items[i].xl = 'd-xl-none';
        }
      }
    }

    ableToRightXl() {
      if (this.viewIndex.xl >= 1) {
        return true;
      } else {
        return false;
      }
    }

    moveRight(e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.ableToRightXl()) {
        this.viewIndex.xl--;
      }
      for (let i = 0; i < this.items.length; i++) {
        if (i >= this.viewIndex.xl && i < (this.viewIndex.xl + this.viewSize.xl)) {
          this.items[i].xl = 'd-xl-block';
        } else {
          this.items[i].xl = 'd-xl-none';
        }
      }
    }

    onClick(product_id) {
      this.onProductClick.emit(product_id);
    }

}
