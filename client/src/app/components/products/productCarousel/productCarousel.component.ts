import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { orderBy } from 'lodash';

import { Settings } from '../../../settings';

@Component ({
  selector: 'app-product-carousel',
  templateUrl: './productCarousel.component.html',
  styleUrls: []
})
export class ProductCarouselComponent implements OnInit {

  @Input() items: any;
  @Input() sm: string;
  @Input() md: string;
  @Input() lg: string;
  @Input() xl: string;
  @Output() onProductClick = new EventEmitter<string>();
  @Output() onTagClick = new EventEmitter<string>();

  viewSize = {
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  };

  viewIndex = {
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  };

    constructor() {}

    ngOnInit () {
      this.viewSize.sm = parseInt(this.sm, 10);
      this.viewSize.md = parseInt(this.md, 10);
      this.viewSize.lg = parseInt(this.lg, 10);
      this.viewSize.xl = parseInt(this.xl, 10);

      this.items = orderBy(this.items, 'order', 'asc');
      for (let i = 0; i < this.items.length; i++) {
        if (i >= this.viewIndex.xl && i < (this.viewIndex.xl + this.viewSize.xl)) {
          this.items[i].xl = 'd-xl-flex';
        } else {
          this.items[i].xl = 'd-xl-none';
        }

        if (i >= this.viewIndex.lg && i < (this.viewIndex.lg + this.viewSize.lg)) {
          this.items[i].lg = 'd-lg-flex';
        } else {
          this.items[i].lg = 'd-lg-none';
        }

        if (i >= this.viewIndex.md && i < (this.viewIndex.md + this.viewSize.md)) {
          this.items[i].md = 'd-md-flex';
        } else {
          this.items[i].md = 'd-md-none';
        }

        if (i >= this.viewIndex.sm && i < (this.viewIndex.sm + this.viewSize.sm)) {
          this.items[i].sm = 'd-sm-flex';
        } else {
          this.items[i].sm = 'd-sm-none';
        }

        this.items[i].xs = 'd-block';
      }
    }

    ableToLeftXl() {
      if (this.viewIndex.xl <= (this.items.length - this.viewSize.xl - 1)) {
        return true;
      } else {
        return false;
      }
    }

    ableToLeftLg() {
      if (this.viewIndex.lg <= (this.items.length - this.viewSize.lg - 1)) {
        return true;
      } else {
        return false;
      }
    }

    ableToLeftMd() {
      if (this.viewIndex.md <= (this.items.length - this.viewSize.md - 1)) {
        return true;
      } else {
        return false;
      }
    }

    ableToLeftSm() {
      if (this.viewIndex.sm <= (this.items.length - this.viewSize.sm - 1)) {
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
      if (this.ableToLeftLg()) {
        this.viewIndex.lg++;
      }
      if (this.ableToLeftMd()) {
        this.viewIndex.md++;
      }
      if (this.ableToLeftSm()) {
        this.viewIndex.sm++;
      }
      for (let i = 0; i < this.items.length; i++) {
        if (i >= this.viewIndex.xl && i < (this.viewIndex.xl + this.viewSize.xl)) {
          this.items[i].xl = 'd-xl-flex';
        } else {
          this.items[i].xl = 'd-xl-none';
        }
        if (i >= this.viewIndex.lg && i < (this.viewIndex.lg + this.viewSize.lg)) {
          this.items[i].lg = 'd-lg-flex';
        } else {
          this.items[i].lg = 'd-lg-none';
        }
        if (i >= this.viewIndex.md && i < (this.viewIndex.md + this.viewSize.md)) {
          this.items[i].md = 'd-md-flex';
        } else {
          this.items[i].md = 'd-md-none';
        }
        if (i >= this.viewIndex.sm && i < (this.viewIndex.sm + this.viewSize.sm)) {
          this.items[i].sm = 'd-sm-flex';
        } else {
          this.items[i].sm = 'd-sm-none';
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

    ableToRightLg() {
      if (this.viewIndex.lg >= 1) {
        return true;
      } else {
        return false;
      }
    }

    ableToRightMd() {
      if (this.viewIndex.md >= 1) {
        return true;
      } else {
        return false;
      }
    }

    ableToRightSm() {
      if (this.viewIndex.sm >= 1) {
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
      if (this.ableToRightLg()) {
        this.viewIndex.lg--;
      }
      if (this.ableToRightMd()) {
        this.viewIndex.md--;
      }
      if (this.ableToRightSm()) {
        this.viewIndex.sm--;
      }
      for (let i = 0; i < this.items.length; i++) {
        if (i >= this.viewIndex.xl && i < (this.viewIndex.xl + this.viewSize.xl)) {
          this.items[i].xl = 'd-xl-flex';
        } else {
          this.items[i].xl = 'd-xl-none';
        }
        if (i >= this.viewIndex.lg && i < (this.viewIndex.lg + this.viewSize.lg)) {
          this.items[i].lg = 'd-lg-flex';
        } else {
          this.items[i].lg = 'd-lg-none';
        }
        if (i >= this.viewIndex.md && i < (this.viewIndex.md + this.viewSize.md)) {
          this.items[i].md = 'd-md-flex';
        } else {
          this.items[i].md = 'd-md-none';
        }
        if (i >= this.viewIndex.sm && i < (this.viewIndex.sm + this.viewSize.sm)) {
          this.items[i].sm = 'd-sm-flex';
        } else {
          this.items[i].sm = 'd-sm-none';
        }
      }
    }

    onClickProduct(product_promoLink) {
      this.onProductClick.emit(product_promoLink);
    }

    onClickTag(e, tag_id) {
      e.stopPropagation();
      e.preventDefault();
      this.onTagClick.emit(tag_id);
    }

}
