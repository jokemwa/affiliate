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
  searchHints: any;

  constructor(
    private modalService: NgbModal,
    private translationService: TranslationService,
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
      this.restService.search(text).subscribe(
        response => {
          this.searchHints = response;
          this.searchHints.products = orderBy(this.searchHints.products, 'title', 'asc');
          this.searchHints.categories = orderBy(this.searchHints.categories, 'name', 'asc');
          this.searchHints.brands = orderBy(this.searchHints.brands, 'name', 'asc');
          this.searchHints.shops = orderBy(this.searchHints.shops, 'name', 'asc');
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
    this.router.navigate(['/']);
  }

  clickFacebook(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
    window.open(this.translation.topNavigation.facebookLink, '_blank');
  }

  clickYoutube(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
    window.open(this.translation.topNavigation.youtubeLink, '_blank');
  }

  clickSearch(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
  }

  clickCoupons(e) {
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
  }

  clickShops(e) {
    e.stopPropagation();
    e.preventDefault();
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
    e.stopPropagation();
    e.preventDefault();
    $('.navbar-collapse').collapse('hide');
  }

  clickCategories(e) {
    e.stopPropagation();
    e.preventDefault();
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
    $('.navbar-collapse').collapse('hide');
    this.router.navigate(['/']);
  }

}
