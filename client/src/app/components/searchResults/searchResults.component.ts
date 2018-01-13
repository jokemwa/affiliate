import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { orderBy } from 'lodash';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';
import { TrackingService } from '../../services/tracking.service';

import { Settings } from '../../settings';

@Component({
  selector: 'app-search-results',
  templateUrl: './searchResults.component.html',
  styleUrls: []
})
export class SearchResultsComponent implements OnInit {

  apiUrl = Settings.apiUrl;

  text: any;
  results: any;

  translation: any;
  isDataReady = false;

  constructor(
    private restService: RESTService,
    private translationService: TranslationService,
    private trackingService: TrackingService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;
    this.route.paramMap
      .switchMap((params: ParamMap) => this.restService.search(params.get('text')))
      .subscribe(response => {
        if (!response) {
          this.router.navigate(['/']);
        }
        this.results = response;
        this.results.products = orderBy(this.results.products, 'title', 'asc');
        this.results.categories = orderBy(this.results.categories, 'name', 'asc');
        this.results.brands = orderBy(this.results.brands, 'name', 'asc');
        this.results.shops = orderBy(this.results.shops, 'name', 'asc');
        this.text = this.route.snapshot.params['text'];
        this.isDataReady = true;
        const action = {
          action: 'load',
          area: {
            name: 'searchResults',
            context: {
              type: 'SearchText',
              value: this.text
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
      },
      err => {
        this.router.navigate(['/']);
        console.log(JSON.stringify(err));
        }
    );
  }

  clickProduct(e, promoLink, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'searchResults',
        context: {
          type: 'SearchText',
          value: this.text
        }
      },
      element: {
        name: 'productsList',
        context: {
          type: 'Product',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/product/' + promoLink]);
  }

  clickCategory(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'searchResults',
        context: {
          type: 'SearchText',
          value: this.text
        }
      },
      element: {
        name: 'categoriesList',
        context: {
          type: 'Category',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/category/' + _id]);
  }

  clickBrand(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'searchResults',
        context: {
          type: 'SearchText',
          value: this.text
        }
      },
      element: {
        name: 'brandsList',
        context: {
          type: 'Brand',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/brand/' + _id]);
  }

  clickShop(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    const action = {
      action: 'click',
      area: {
        name: 'searchResults',
        context: {
          type: 'SearchText',
          value: this.text
        }
      },
      element: {
        name: 'shopsList',
        context: {
          type: 'Shop',
          value: _id
        }
      }
    };
    this.trackingService.trackAction(action);
    this.router.navigate(['/shop/' + _id]);
  }

}
