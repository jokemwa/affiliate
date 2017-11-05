import { Component, Input  } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';



import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-edit-product',
  templateUrl: './editProduct.component.html',
  styleUrls: []
})

export class EditProductComponent implements OnInit {

  @Input() _id;

  Step = 'selectImages'; // next: selectImages, editDetails, preview

  isDataReady = false;

  product: any;

  newShop: String = '';
  newCategory: String = '';
  newBrand: String = '';
  newTag: String = '';

  marketplace: any;
  existedCategories: any;
  existedTags: any;
  existedBrands: any;
  existedBadges: any;

  selectedImage: any;
  productTags: any;
  productBadges: any;
  productShop: any;
  productCategory: any;
  productBrand: any;

  addedTag = '';

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}


  ngOnInit(): void {
      this.getData();
  }

  getData() {

    this.restService.getProduct(this._id).subscribe(
      response => {
        this.product = response;
        const resp = JSON.parse(JSON.stringify(response));
        this.productCategory = resp.category;
        this.productBrand = resp.brand;
        this.productShop = resp.shop;
        this.productBadges = resp.badges;
        this.productTags = resp.tags;
        this.selectedImage = resp.frontImage;
        const observables = [];
        observables.push(this.restService.getCategories());
        observables.push(this.restService.getTags());
        observables.push(this.restService.getBrands());
        observables.push(this.restService.getBadges());
        observables.push(this.restService.getMarketplaceShops(resp.marketplace));
        Observable.forkJoin(observables).subscribe(
          resp => {
            this.existedCategories = resp[0];
            this.existedTags = resp[1];
            this.existedBrands = resp[2];
            this.existedBadges = resp[3];
            this.marketplace = resp[4];
            this.isDataReady = true;
          },
          err => {
            if (err.status === 401 || err.status === 403) {
              this.restService.logout();
              this.router.navigate(['/login']);
            } else {
            window.alert(JSON.stringify(err));
            console.log(JSON.stringify(err));
            }
        });
      },
      err => {
        if (err.status === 401 || err.status === 403) {
          this.restService.logout();
          this.router.navigate(['/login']);
        } else {
          window.alert(JSON.stringify(err));
          console.log(JSON.stringify(err));
        }
      }
    );
  }

  selectImage(image) {
      for (let i = 0; i < this.product.images.length; i++) {
        if (this.product.images[i]._id === image) {
          this.selectedImage = this.product.images[i];
          break;
        }
      }
  }

  getCategries() {
      this.restService.getCategories().subscribe(
        response => {
        this.existedCategories = response;
      },
      err => {
        if (err.status === 401 || err.status === 403) {
          this.restService.logout();
          this.router.navigate(['/login']);
        } else {
          window.alert(JSON.stringify(err));
          console.log(JSON.stringify(err));
        }
      }
    );
  }

  getTags() {
    this.restService.getTags().subscribe(
      response => {
      this.existedTags = response;
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      }
    }
  );
  }

  getBrands () {
    this.restService.getBrands().subscribe(
      response => {
      this.existedBrands = response;
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      }
    }
  );
  }

  getBadges () {
    this.restService.getBadges().subscribe(
      response => {
      this.existedBadges = response;
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      }
    }
  );
  }

  getMarketplace () {
    this.restService.getMarketplaceShops(this.product.marketplace).subscribe(
      response => {
      this.marketplace = response;
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      }
    }
  );
  }


  addMarketplaceShop () {
    const shop = {name: this.newShop};
    this.restService.createShop(shop).subscribe(
      response => {
        this.restService.addShopToMarketplace(this.marketplace._id, response._id).subscribe(
          resp => {
            this.getMarketplace();
          },
          err => {
            if (err.status === 401 || err.status === 403) {
              this.restService.logout();
              this.router.navigate(['/login']);
            } else {
              window.alert(JSON.stringify(err));
              console.log(JSON.stringify(err));
            }
          }
        );
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      }
    }
  );
  }

  addCategory () {
    const category = {name: this.newCategory};
    this.restService.createCategory(category).subscribe(
      response => {
      this.getCategries();
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      }
    }
  );
  }

  addTag () {
    const tag = {name: this.newTag};
    this.restService.createTag(tag).subscribe(
      response => {
      this.getTags();
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      }
    }
  );
  }

  addTagToProduct () {
    let existed = false;
    for (let j = 0; j < this.productTags.length; j++) {
      if (this.productTags[j]._id === this.addedTag) {
        existed = true;
      }
    }

    if (!existed) {
      for (let i = 0; i < this.existedTags.length; i++) {
        if (this.existedTags[i]._id === this.addedTag) {

          this.productTags.push(this.existedTags[i]);
          this.productTags = this.productTags.slice();
          break;
        }
      }
    }
  }

  removeTagForProduct (tagId: String) {

    for (let i = 0; i < this.productTags.length; i++) {
      if (this.productTags[i]._id === tagId) {

        this.productTags.splice(i, 1);
        this.productTags = this.productTags.slice();
        break;
      }
    }
  }

  addBrand () {
    const brand = {name: this.newBrand};
    this.restService.createBrand(brand).subscribe(
      response => {
      this.getBrands();
    },
    err => {
      if (err.status === 401 || err.status === 403) {
        this.restService.logout();
        this.router.navigate(['/login']);
      } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      }
    }
  );
  }

  selectBadge (e, _id) {

    if (e.target.checked) {
      for (let i = 0; i < this.existedBadges.length; i++) {
        if (this.existedBadges[i]._id === _id) {

          this.productBadges.push(this.existedBadges[i]);
          this.productBadges = this.productBadges.slice();
          break;
        }
      }
    } else {
      for (let i = 0; i < this.productBadges.length; i++) {
        if (this.productBadges[i]._id === _id) {
          this.productBadges.splice(i, 1);
          this.productBadges = this.productBadges.slice();
          break;
        }
      }
    }
  }

  isBadgeSelected(_id) {
    for (let i = 0; i < this.productBadges.length; i++) {
      if (this.productBadges[i]._id === _id) {
        return true;
      }
    }
    return false;
  }

  clickBuyButton () {
    window.open(this.product.buyLink, '_blank');
  }


  toEditDetails() {
    for (let i = 0; i < this.product.images.length; i++) {
      if (this.product.images[i]._id === this.selectedImage._id) {
        this.product.frontImage.hiRes = this.product.images[i].hiRes;
        this.product.frontImage.thumb = this.product.images[i].thumb;
        break;
      }
    }
    this.Step = 'editDetails';
  }

  toPreview() {
    if (this.product.title === undefined || this.product.title === '') {
      window.alert('Title is not defined.');
      return;
    }

    if (this.product.description === undefined || this.product.description === '') {
      window.alert('Description is not defined.');
      return;
    }

    if (this.productCategory._id === undefined || this.productCategory._id === '') {
      window.alert('Category is not defined.');
      return;
    }

    for (let i = 0; i < this.marketplace.shops.length; i++) {
      if (this.marketplace.shops[i]._id === this.productShop._id) {
        this.productShop.name = this.marketplace.shops[i].name;
      }
    }

    for (let i = 0; i < this.existedCategories.length; i++) {
      if (this.existedCategories[i]._id === this.productCategory._id) {
        this.productCategory.name = this.existedCategories[i].name;
      }
    }

    for (let i = 0; i < this.existedBrands.length; i++) {
      if (this.existedBrands[i]._id === this.productBrand._id) {
        this.productBrand.name = this.existedBrands[i].name;
      }
    }


    this.Step = 'preview';
  }

  backToEditDetails() {
    this.Step = 'editDetails';
  }

  backToSelectImages() {
    this.Step = 'selectImages';
  }

  saveProduct() {
    const observables = [];


    if (this.product.category._id !== this.productCategory._id) {
      observables.push(this.restService.changeProductCategory(this.product.category._id, this.productCategory._id, this.product._id));
    }

    if (this.product.shop._id !== this.productShop._id) {
      observables.push(this.restService.removeProductFromShop(this.product.shop._id, this.product._id));
      observables.push(this.restService.addProductToShop(this.productShop._id, this.product._id));
    }

    if (this.product.brand._id !== this.productBrand._id) {
      if (this.product.brand._id !== '') {
        observables.push(this.restService.removeProductFromBrand(this.product.brand._id, this.product._id));
      }
      if (this.productBrand._id !== '') {
        observables.push(this.restService.addProductToBrand(this.productBrand._id, this.product._id));
      }
    }

    for (let i = 0; i < this.product.tags.length; i++) {
      observables.push(this.restService.removeProductFromTag(this.product.tags[i]._id, this.product._id));
    }
    for (let i = 0; i < this.productTags.length; i++) {
      observables.push(this.restService.addProductToTag(this.productTags[i]._id, this.product._id));
    }

    this.product.badges = [];
    for (let i = 0; i < this.productBadges.length; i++) {
      this.product.badges.push(this.productBadges[i]._id);
    }

    delete(this.product.category);
    delete(this.product.brand);
    delete(this.product.shop);
    delete(this.product.tags);
    observables.push(this.restService.updateProduct(this.product));

    Observable.forkJoin(observables).subscribe(
      response => {
        this.activeModal.close('Saved');
      },
      err => {
        if (err.status === 401 || err.status === 403) {
          this.restService.logout();
          this.router.navigate(['/login']);
        } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
        }
    });

  }

  cancel() {
      this.activeModal.dismiss();
  }

}
