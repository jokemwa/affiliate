import { Component, Input, OnInit } from '@angular/core';

import { RESTService } from '../../../services/rest.service';
import { TranslationService } from '../../../services/translation.service';

@Component ({
  selector: 'app-product-price',
  templateUrl: './productPrice.component.html',
  styleUrls: ['./productPrice.component.css']
})
export class ProductPriceComponent implements OnInit {

    @Input() product: any;

    translation: any;
    price: any;
    noPrice = false;

    constructor(
      private restService: RESTService,
      private translationService: TranslationService
    ) {}


    ngOnInit () {
      this.translation = this.translationService.translation;
      this.restService.getPrice(this.product._id)
      .subscribe(
        response => {
          if (!response) {
            this.noPrice = true;
          } else {
            this.price = response;
          }
        },
        err => {
          console.log(JSON.stringify(err));
          }
      );
    }
}
