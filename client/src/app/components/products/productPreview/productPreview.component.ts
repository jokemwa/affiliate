import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../services/rest.service';
import { TrackingService } from '../../../services/tracking.service';
import { TranslationService } from '../../../services/translation.service';

import { Settings } from '../../../settings';

@Component({
  selector: 'app-product-preview',
  templateUrl: './productPreview.component.html',
  styleUrls: []
})
export class ProductPreviewComponent  implements OnInit {

  apiUrl = Settings.apiUrl;

  @Input() id;

  product: any;
  translation: any;
  isDataReady = false;

  activeImage: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private translationService: TranslationService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.translation = this.translationService.translation;

    this.restService.getProductPreview(this.id).subscribe(
      response => {
        this.product = response;
        this.activeImage = this.product.frontImage;
        this.product.description = this.product.description.substring(0, 200) + '...';
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

  cancel() {
    this.activeModal.dismiss();
  }

  viewMore(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/product/' + this.product.promoLink]);
    this.activeModal.close();
  }

}
