import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../../services/rest.service';
import { TranslationService } from '../../../services/translation.service';

import { Settings } from '../../../settings';

@Component({
  selector: 'app-product-view',
  templateUrl: './productView.component.html',
  styleUrls: [],
})
export class ProductViewComponent implements OnInit {

  apiUrl = Settings.apiUrl;

  product: any;

  activeImage: any;
  translation: any;
  isDataReady = false;


  constructor(
    private restService: RESTService,
    private translationService: TranslationService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;

      this.route.paramMap
      .switchMap((params: ParamMap) => this.restService.getProduct(params.get('link')))
      .subscribe(response => {
        this.product = response;
        this.activeImage = this.product.frontImage;
        this.isDataReady = true;
      },
      err => {
        console.log(JSON.stringify(err));
        }
    );
  }

  selectImage(id: string) {
    for (let i = 0; i < this.product.images.length; i++) {
      if (this.product.images[i]._id === id) {
        this.activeImage = this.product.images[i];
        break;
      }
    }
  }

  clickBuyButton () {
    window.open(this.product.buyLink, '_blank');
  }

  clickTag (_id) {
    this.router.navigate(['/tag/' + _id]);
  }

  clickShop (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/shop/' + _id]);
  }

  clickCategory (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/category/' + _id]);
  }

  clickBrand (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/brand/' + _id]);
  }

}
