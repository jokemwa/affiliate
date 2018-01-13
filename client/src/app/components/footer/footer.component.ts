import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubscribeResultComponent } from './childs/subscribeResult/subscribeResult.component';

import { SelectCategoryComponent } from '../topNavigation/childs/selectCategory/selectCategory.component';
import { SelectBrandComponent } from '../topNavigation/childs/selectBrand/selectBrand.component';
import { SelectShopGroupComponent } from '../topNavigation/childs/selectShopGroup/selectShopGroup.component';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';
import { TrackingService } from '../../services/tracking.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: []
})
export class FooterComponent implements OnInit {

  isDataReady = false;

  translation: any;

  categories: any;
  shopGroups: any;
  brands: any;

  subscribeEmail: any;

  EMAIL_REGEX = '[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*';

  show = 10;

  constructor(
    private modalService: NgbModal,
    private translationService: TranslationService,
    private restService: RESTService,
    private trackingService: TrackingService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;
    const observables = [];
      observables.push(this.restService.getCategories());
      observables.push(this.restService.getBrands());
      observables.push(this.restService.getShopGroups());
      Observable.forkJoin(observables).subscribe(
        response => {
          this.categories = response[0];
          this.brands = response[1];
          this.shopGroups = response[2];
          this.isDataReady = true;
        },
        err => {
          console.log(JSON.stringify(err));
          }
      );
  }

  clickFacebook(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'facebookLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    window.open(this.translation.topNavigation.facebookLink, '_blank');
  }

  clickYoutube(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'youtubeLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    window.open(this.translation.topNavigation.youtubeLink, '_blank');
  }

  clickEmail(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'emailLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    window.open('mailto:' + this.translation.footer.contactEmail, '_blank');
  }

  clickSubscribe() {
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'subscribeButton',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    this.restService.subscribeEmail(this.subscribeEmail).subscribe(
      response => {
        const modalRef = this.modalService.open(SubscribeResultComponent, {size: 'sm'});
        modalRef.componentInstance.result = response;
      },
      err => {
        console.log(JSON.stringify(err));
    });
  }

  clickCategories(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'categoriesLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    this.restService.getCategories().subscribe(
      response => {
        const modalRef = this.modalService.open(SelectCategoryComponent, {size: 'lg'});
        modalRef.componentInstance.categories = response;
      },
      err => {
        console.log(JSON.stringify(err));
    });
  }

  clickBrands(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'brandsLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    this.restService.getBrands().subscribe(
      response => {
        const modalRef = this.modalService.open(SelectBrandComponent, {size: 'lg'});
        modalRef.componentInstance.brands = response;
      },
      err => {
        console.log(JSON.stringify(err));
    });
  }

  clickShops(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'shopsLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    this.restService.getShopGroups().subscribe(
      response => {
        const modalRef = this.modalService.open(SelectShopGroupComponent, {size: 'sm'});
        modalRef.componentInstance.shopGroups = response;
      },
      err => {
        console.log(JSON.stringify(err));
    });
  }

  onClickCategory(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'categoryLink',
        context: {
          type: 'Category',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/category/' + _id]);
  }

  onClickBrand(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'brandLink',
        context: {
          type: 'Brand',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/brand/' + _id]);
  }

  onClickShopGroup(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'footer',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'shopGroupsLink',
        context: {
          type: 'ShopGroup',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/shop-group/' + _id]);
  }
}
