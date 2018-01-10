import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { orderBy, max } from 'lodash';

import { Settings } from '../../../settings';

@Component ({
  selector: 'app-product-carousel',
  templateUrl: './productCarousel.component.html',
  styleUrls: ['./productCarousel.component.css']
})
export class ProductCarouselComponent implements OnInit, AfterViewInit {

  apiUrl = Settings.apiUrl;

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

  maxHeight = 0;

  marker = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    constructor(private cdr: ChangeDetectorRef) {}

    mapCards() {
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

      this.cdr.detectChanges();
    }

    calcHeights() {
      this.maxHeight = 0;
      const height = [0, 0, 0, 0];
      // Max xl height
      for (let j = 0; j < this.items.length - this.viewSize.xl; j++) {
        for (let i = 0; i < this.items.length; i++) {
          if (i >= j && i < (j + this.viewSize.xl)) {
            this.items[i].xl = 'd-xl-flex';
          } else {
            this.items[i].xl = 'd-xl-none';
          }
          this.cdr.detectChanges();
          const elements = document.getElementsByClassName(this.marker);
          for (let k = 0; k < elements.length; k++) {
            if (elements[k].clientHeight >= height[0]) {
              height[0] = elements[k].clientHeight;
            }
          }
        }
      }
      // console.log('xl', height[0]);

      // Max md height
      for (let j = 0; j < this.items.length - this.viewSize.md; j++) {
        for (let i = 0; i < this.items.length; i++) {
          if (i >= j && i < (j + this.viewSize.md)) {
            this.items[i].md = 'd-md-flex';
          } else {
            this.items[i].md = 'd-md-none';
          }
          this.cdr.detectChanges();
          const elements = document.getElementsByClassName(this.marker);
          for (let k = 0; k < elements.length; k++) {
            if (elements[k].clientHeight >= height[1]) {
              height[1] = elements[k].clientHeight;
            }
          }
        }
      }
      // console.log('md', height[1]);

      // Max lg height
      for (let j = 0; j < this.items.length - this.viewSize.lg; j++) {
        for (let i = 0; i < this.items.length; i++) {
          if (i >= j && i < (j + this.viewSize.lg)) {
            this.items[i].lg = 'd-lg-flex';
          } else {
            this.items[i].lg = 'd-lg-none';
          }
          this.cdr.detectChanges();
          const elements = document.getElementsByClassName(this.marker);
          for (let k = 0; k < elements.length; k++) {
            if (elements[k].clientHeight >= height[2]) {
              height[2] = elements[k].clientHeight;
            }
          }
        }
      }
      // console.log('lg', height[2]);

      // Max sm height
      for (let j = 0; j < this.items.length - this.viewSize.sm; j++) {
        for (let i = 0; i < this.items.length; i++) {
          if (i >= j && i < (j + this.viewSize.sm)) {
            this.items[i].sm = 'd-sm-flex';
          } else {
            this.items[i].sm = 'd-sm-none';
          }
          this.cdr.detectChanges();
          const elements = document.getElementsByClassName(this.marker);
          for (let k = 0; k < elements.length; k++) {
            if (elements[k].clientHeight >= height[3]) {
              height[3] = elements[k].clientHeight;
            }
          }
        }
      }
      // console.log('sm', height[3]);
      this.maxHeight =  max(height);

      this.mapCards();
    }

    onResize(e) {
      this.calcHeights();
    }

    ngAfterViewInit () {
      this.calcHeights();
      this.mapCards();
    }

    ngOnInit () {
      this.items = orderBy(this.items, 'order', 'asc');
      this.viewSize.sm = parseInt(this.sm, 10);
      this.viewSize.md = parseInt(this.md, 10);
      this.viewSize.lg = parseInt(this.lg, 10);
      this.viewSize.xl = parseInt(this.xl, 10);
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].xl = '';
        this.items[i].lg = '';
        this.items[i].md = '';
        this.items[i].sm = '';
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
          if (i === (this.viewIndex.xl + this.viewSize.xl - 1)) {
            this.items[i].xl += ' show-xl';
          }
        } else {
          this.items[i].xl = 'd-xl-none';
        }
        if (i >= this.viewIndex.lg && i < (this.viewIndex.lg + this.viewSize.lg)) {
          this.items[i].lg = 'd-lg-flex';
          if (i === (this.viewIndex.lg + this.viewSize.lg - 1)) {
            this.items[i].lg += ' show-lg';
          }
        } else {
          this.items[i].lg = 'd-lg-none';
        }
        if (i >= this.viewIndex.md && i < (this.viewIndex.md + this.viewSize.md)) {
          this.items[i].md = 'd-md-flex';
          if (i === (this.viewIndex.md + this.viewSize.md - 1)) {
            this.items[i].md += ' show-md';
          }
        } else {
          this.items[i].md = 'd-md-none';
        }
        if (i >= this.viewIndex.sm && i < (this.viewIndex.sm + this.viewSize.sm)) {
          this.items[i].sm = 'd-sm-flex';
          if (i === (this.viewIndex.sm + this.viewSize.sm - 1)) {
            this.items[i].sm += ' show-sm';
          }
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
          if (i === this.viewIndex.xl) {
            this.items[i].xl += ' show-xl';
          }
        } else {
          this.items[i].xl = 'd-xl-none';
        }
        if (i >= this.viewIndex.lg && i < (this.viewIndex.lg + this.viewSize.lg)) {
          this.items[i].lg = 'd-lg-flex';
          if (i === this.viewIndex.lg) {
            this.items[i].lg += ' show-lg';
          }
        } else {
          this.items[i].lg = 'd-lg-none';
        }
        if (i >= this.viewIndex.md && i < (this.viewIndex.md + this.viewSize.md)) {
          this.items[i].md = 'd-md-flex';
          if (i === this.viewIndex.md) {
            this.items[i].md += ' show-md';
          }
        } else {
          this.items[i].md = 'd-md-none';
        }
        if (i >= this.viewIndex.sm && i < (this.viewIndex.sm + this.viewSize.sm)) {
          this.items[i].sm = 'd-sm-flex';
          if (i === this.viewIndex.sm) {
            this.items[i].sm += ' show-sm';
          }
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
