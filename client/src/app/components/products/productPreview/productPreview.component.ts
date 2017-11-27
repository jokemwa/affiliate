import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../services/rest.service';
import { TrackingService } from '../../../services/tracking.service';

@Component({
  selector: 'app-product-preview',
  templateUrl: './productPreview.component.html',
  styleUrls: []
})
export class ProductPreviewComponent  implements OnInit {

  @Input() id;

  product: any;
  translation: any;
  isDataReady = false;

  activeImage: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {

  }

  ngOnInit(): void {
    const observables = [];
    observables.push(this.restService.getTranslation());
    observables.push(this.restService.getProductPreview(this.id));
    Observable.forkJoin(observables).subscribe(
      response => {
        this.translation = response[0];
        this.product = response[1];
        this.activeImage = this.product.frontImage;
        this.product.description = this.product.description.substring(0, 128) + '...';
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
