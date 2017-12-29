import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../../services/rest.service';
import { TranslationService } from '../../../services/translation.service';

import { Settings } from '../../../settings';

import { ProductPreviewComponent } from '../productPreview/productPreview.component';


@Component({
  selector: 'app-product-view',
  templateUrl: './productView.component.html',
  styleUrls: [],
})
export class ProductViewComponent implements OnInit {

  apiUrl = Settings.apiUrl;

  product: any;
  similar: any;

  activeImage: any;
  translation: any;
  isDataReady = false;


  constructor(
    private modalService: NgbModal,
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
        this.restService.getSimilarProducts(this.product._id)
        .subscribe(resp => {
          this.similar = resp;
          this.isDataReady = true;
        },
          err => {
            console.log(JSON.stringify(err));
            }
        );
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

  clickTag (e, _id) {
    e.stopPropagation();
    e.preventDefault();
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
    window.alert('here');
    this.router.navigate(['/category/' + _id]);
  }

  clickBrand (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/brand/' + _id]);
  }

  showProductDetail(promoLink: string) {
    for (let i = 0; i < this.similar.length; i++) {
      if (this.similar[i].product.promoLink === promoLink) {
        const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
        modalRef.componentInstance.id = this.similar[i].product._id;
      }
    }
  }

  showTagResults(tag_id: string) {
    this.router.navigate(['/tag/' + tag_id]);
  }
}
