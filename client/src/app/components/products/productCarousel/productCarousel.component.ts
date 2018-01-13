import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { orderBy, max } from 'lodash';
import { NgxCarousel } from 'ngx-carousel';

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

  @Output() onProductClick = new EventEmitter<any>();
  @Output() onTagClick = new EventEmitter<string>();

  public carouselTile: NgxCarousel;
  public carouselTileItems: Array<any>;

  viewSize = {
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  };

  maxHeight = 0;
  marker = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  firstSlide = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit () {
    this.calcHeights();
  }

  ngOnInit () {
    this.viewSize.sm = parseInt(this.sm, 10);
    this.viewSize.md = parseInt(this.md, 10);
    this.viewSize.lg = parseInt(this.lg, 10);
    this.viewSize.xl = parseInt(this.xl, 10);

    this.items = orderBy(this.items, 'order', 'desc');
    this.firstSlide = this.items.length - this.viewSize.xl;

    this.carouselTile = {
      grid: {xs: 1, sm: this.viewSize.md, md: this.viewSize.lg, lg: this.viewSize.xl, all: 0},
      slide: 1,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: false
      },
      touch: true,
      easing: 'ease',
    };
  }

  calcHeights() {
    this.maxHeight = 0;
    this.cdr.detectChanges();
    let height = 0;
    // Max xl height
    const elements = document.getElementsByClassName(this.marker);
    for (let k = 0; k < elements.length; k++) {
      if (elements[k].clientHeight >= height) {
      height = elements[k].clientHeight;
      }
    }
    this.maxHeight = height;
    // console.log(this.marker, this.maxHeight);
    this.cdr.detectChanges();
  }

  onResize(e) {
    this.calcHeights();
  }

  onClickProduct(promoLink, _id) {
    this.onProductClick.emit({promoLink: promoLink, _id: _id});
  }

  onClickTag(e, tag_id) {
    e.stopPropagation();
    e.preventDefault();
    this.onTagClick.emit(tag_id);
  }

}
