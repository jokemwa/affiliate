import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../../services/rest.service';
import { TranslationService } from '../../../services/translation.service';
import { TrackingService } from '../../../services/tracking.service';

import { Settings } from '../../../settings';


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
    private trackingService: TrackingService,
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
        const action = {
          action: 'load',
          area: {
            name: 'productView',
            context: {
              type: 'Product',
              value: this.product._id
            }
          },
          element: {
            name: '',
            context: {
              type: '',
              value: ''
            }
          }
        };
        this.trackingService.trackAction(action);
        this.restService.getSimilarProducts(this.product._id)
        .subscribe(resp => {
          this.similar = resp;
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
    const action = {
      action: 'click',
      area: {
        name: 'productView',
        context: {
          type: 'Product',
          value: this.product._id
        }
      },
      element: {
        name: 'buyButton',
        context: {
          type: 'Product',
          value: this.product._id
        }
      }
    };
    this.trackingService.trackAction(action);
    window.open(this.product.buyLink, '_blank');
  }

  clickTag (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'productView',
        context: {
          type: 'Product',
          value: this.product._id
        }
      },
      element: {
        name: 'productDescription',
        context: {
          type: 'Tag',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/tag/' + _id]);
  }

  clickShop (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'productView',
        context: {
          type: 'Product',
          value: this.product._id
        }
      },
      element: {
        name: 'productDescription',
        context: {
          type: 'Shop',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/shop/' + _id]);
  }

  clickCategory (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'productView',
        context: {
          type: 'Product',
          value: this.product._id
        }
      },
      element: {
        name: 'productDescription',
        context: {
          type: 'Category',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/category/' + _id]);
  }

  clickBrand (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'productView',
        context: {
          type: 'Product',
          value: this.product._id
        }
      },
      element: {
        name: 'productDescription',
        context: {
          type: 'Brand',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/brand/' + _id]);
  }

  showProductDetail(product: any) {
    const action = {
      action: 'click',
      area: {
        name: 'productView',
        context: {
          type: 'Product',
          value: this.product._id
        }
      },
      element: {
        name: 'productsList',
        context: {
          type: 'Product',
          value: product._id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/product/' + product.promoLink]);
  }

  showTagResults(tag_id: string) {
    const action = {
      action: 'click',
      area: {
        name: 'productView',
        context: {
          type: 'Product',
          value: this.product._id
        }
      },
      element: {
        name: 'productsList',
        context: {
          type: 'Tag',
          value: tag_id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/tag/' + tag_id]);
  }

}
