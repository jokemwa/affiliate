import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';


@Component({
  selector: 'app-top-navigation',
  templateUrl: './topNavigation.component.html',
  styleUrls: []
})
export class TopNavigationComponent implements OnInit {

  isDataLoaded = false;

  translation: any;

  constructor(
    private modalService: NgbModal,
    private restService: RESTService

  ) {}

  ngOnInit(): void {
    this.getTranslation();
  }

  getTranslation() {
    this.restService.getTranslation().subscribe(
      response => {
          this.translation = response;
          this.isDataLoaded = true;
      },
      err => {
        console.log(JSON.stringify(err));
    });
  }


  clickLogoTitle(e) {
    e.preventDefault();
  }

  clickFacebook(e) {
    e.preventDefault();
  }

  clickYoutube(e) {
    e.preventDefault();
  }

  clickSearch(e) {
    e.preventDefault();
  }

  clickCoupons(e) {
    e.preventDefault();
  }

  clickMarketplaces(e) {
    e.preventDefault();
  }

  clickShops(e) {
    e.preventDefault();
  }

  clickBrands(e) {
    e.preventDefault();
  }

  clickSuggestions(e) {
    e.preventDefault();
  }

  clickCategories(e) {
    e.preventDefault();
  }

  clickHome(e) {
    e.preventDefault();
  }


  /*openAddWindow() {
    const modalRef = this.modalService.open(AddProductComponent, {size: 'lg'});

  }*/

}
