import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { orderBy } from 'lodash';

declare var jquery: any;
declare var $: any;

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';
import { TrackingService } from '../../services/tracking.service';

import { SelectCategoryComponent } from './childs/selectCategory/selectCategory.component';
import { SelectBrandComponent } from './childs/selectBrand/selectBrand.component';
import { SelectShopGroupComponent } from './childs/selectShopGroup/selectShopGroup.component';


@Component({
  selector: 'app-top-navigation',
  templateUrl: './topNavigation.component.html',
  styleUrls: ['./topNavigation.component.css']
})
export class TopNavigationComponent implements OnInit {

  translation: any;
  @ViewChild('searchInput') searchInput;
  searchInputField: any;
  searchHints: any;

  constructor(
    private modalService: NgbModal,
    private translationService: TranslationService,
    private trackingService: TrackingService,
    private restService: RESTService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;

    Observable.fromEvent(this.searchInput.nativeElement, 'input')
    .debounceTime(400)
    .distinctUntilChanged()
    .map((event: KeyboardEvent) =>
    (<HTMLInputElement>event.target).value)
    .subscribe(text => {
      if (text.length < 3) {
        this.searchHints = undefined;
        return;
      }
      this.restService.search(text).subscribe(
        response => {
          if (response) {
            if (response.products.length !== 0
              || response.categories.length !== 0
              || response.brands.length !== 0
              || response.shops.length !== 0 ) {
                this.searchHints = response;
                this.searchHints.products = orderBy(this.searchHints.products, 'title', 'asc');
                this.searchHints.categories = orderBy(this.searchHints.categories, 'name', 'asc');
                this.searchHints.brands = orderBy(this.searchHints.brands, 'name', 'asc');
                this.searchHints.shops = orderBy(this.searchHints.shops, 'name', 'asc');
              } else {
                this.searchHints = undefined;
              }
          } else {
            this.searchHints = undefined;
          }
        },
        err => {
          this.searchHints = undefined;
          console.log(JSON.stringify(err));
        }
      );
    });
  }

  clickLogoTitle(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'Logo',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/']);
  }

  clickFacebook(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
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
    $('.navbar-collapse').collapse('hide');
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
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

  clickSearch() {
    $('.navbar-collapse').collapse('hide');
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'searchButton',
        context: {
          type: 'SearchText',
          value: this.searchInput.nativeElement.value
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/search/' + this.searchInput.nativeElement.value]);
    this.searchHints = undefined;
    this.searchInput.nativeElement.value = '';
    this.searchInputField = undefined;
  }

  clickProductHint(promoLink: string, product_id: string) {
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'searchProductHint',
        context: {
          type: 'Product',
          value: product_id
        }
      }
    };
    this.trackingService.trackAction(action);

    this.router.navigate(['/product/' + promoLink]);
    this.searchHints = undefined;
    this.searchInput.nativeElement.value = '';
  }

  clickCategoryHint(_id: string) {
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'searchCategoryHint',
        context: {
          type: 'Category',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);

    this.router.navigate(['/category/' + _id]);
    this.searchHints = undefined;
    this.searchInput.nativeElement.value = '';
  }

  clickBrandHint(_id: string) {
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'searchBrandHint',
        context: {
          type: 'Brand',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);

    this.router.navigate(['/brand/' + _id]);
    this.searchHints = undefined;
    this.searchInput.nativeElement.value = '';

  }

  clickShopHint(_id: string) {
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'searchShopHint',
        context: {
          type: 'Shop',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);

    this.router.navigate(['/shop/' + _id]);
    this.searchHints = undefined;
    this.searchInput.nativeElement.value = '';
  }

  clickCoupons(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'couponsLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
  }

  clickShops(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
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
        $('.navbar-collapse').collapse('hide');
        const modalRef = this.modalService.open(SelectShopGroupComponent, {size: 'sm'});
        modalRef.componentInstance.shopGroups = response;
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
        name: 'topNavigation',
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
        $('.navbar-collapse').collapse('hide');
        const modalRef = this.modalService.open(SelectBrandComponent, {size: 'lg'});
        modalRef.componentInstance.brands = response;
      },
      err => {
        console.log(JSON.stringify(err));
    });
  }

  clickHelp(e) {
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'helpLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
  }

  clickCategories(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
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
        $('.navbar-collapse').collapse('hide');
        const modalRef = this.modalService.open(SelectCategoryComponent, {size: 'lg'});
        modalRef.componentInstance.categories = response;
      },
      err => {
        console.log(JSON.stringify(err));
    });
  }

  clickHome(e) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'topNavigation',
        context: {
          type: '',
          value: ''
        }
      },
      element: {
        name: 'homeLink',
        context: {
          type: '',
          value: ''
        }
      }
    };
    this.trackingService.trackAction(action);
    $('.navbar-collapse').collapse('hide');
    this.router.navigate(['/']);
  }

}
