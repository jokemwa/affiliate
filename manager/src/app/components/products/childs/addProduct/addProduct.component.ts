import { Component } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';



import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './addProduct.component.html',
  styleUrls: []
})

export class AddProductComponent implements OnInit {


  Step: String = 'addLink'; // next: processLink, selectImages, editDetails, preview

  isDataReady = false;

  link: String = '';
  buyLinkPresent: any;

  product: any;

  marketplace: any;
  newShop: String = '';
  newCategory: String = '';
  newBrand: String = '';
  newTag: String = '';

  marketplaces = [];
  existedCategories = [];
  existedTags = [];
  existedBrands = [];
  existedBadges = [];

  selectedImage: any;
  productTags = [];
  productBadges = [];
  productShop = {
    name: '',
    _id: ''
  };
  productCategory = {
    name: '',
    _id: ''
  };
  productBrand = {
    name: '',
    _id: ''
  };
  addedTag: String = '';

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}


  ngOnInit(): void {
      this.getCategries();
      this.getTags();
      this.getBrands();
      this.getBadges();
      this.getMarketplaces();

  }

  getMarketplaces() {
    this.restService.getMarketplaces().subscribe(
      response => {
        this.marketplaces = response;
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
      if (response.hasShops === false) {
        this.productShop._id = response.shops[0]._id;
      }
      this.Step = 'editDetails';
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

  clickBuyButton () {
    window.open(this.product.buyLink, '_blank');
  }

  sendLink() {
    this.Step = 'processLink';
    this.restService.createProduct(this.link).subscribe(
      response => {
          this.product = response;
          this.selectedImage = this.product.images[0];
          this.Step = 'selectImages';
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

  backToSendLink() {
    if (this.product._id) {
      this.restService.deleteProduct(this.product._id).subscribe(
        response => {
          this.Step = 'addLink';
          this.link = '';
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
  }

  toEditDetails() {
    for (let i = 0; i < this.product.images.length; i++) {
      if (this.product.images[i]._id === this.selectedImage._id) {
        this.product.frontImage.hiRes = this.product.images[i].hiRes;
        this.product.frontImage.thumb = this.product.images[i].thumb;
        break;
      }
    }
    this.restService.updateProduct(this.product).subscribe(
      response => {
        this.product = response;
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
    this.buyLinkPresent = decodeURIComponent(this.product.buyLink);

    this.Step = 'preview';
  }

  backToEditDetails() {
    this.Step = 'editDetails';
  }

  backToSelectImages() {
    this.Step = 'selectImages';
  }

  saveProduct() {
    for (let i = 0; i < this.productBadges.length; i++) {
      this.product.badges.push(this.productBadges[i]._id);
    }
    const observables = [];

    observables.push(this.restService.updateProduct(this.product));
    observables.push(this.restService.addProductToCategory(this.productCategory._id, this.product._id));
    if (this.productBrand._id !== '') {
      observables.push(this.restService.addProductToBrand(this.productBrand._id, this.product._id));
    }
    if (this.productShop._id !== '') {
      observables.push(this.restService.addProductToShop(this.productShop._id, this.product._id));
    }
    for (let i = 0; i < this.productTags.length; i++) {
      observables.push(this.restService.addProductToTag(this.productTags[i]._id, this.product._id));
    }

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
    if (this.product) {
      this.restService.deleteProduct(this.product._id).subscribe(
        response => {
          this.activeModal.dismiss();
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
    } else {
      this.activeModal.dismiss();
    }

  }

}
