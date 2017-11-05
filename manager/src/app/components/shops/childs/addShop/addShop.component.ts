import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { RESTService } from '../../../../services/rest.service';
import { ImageLoaderComponent } from '../../../imageLoader/imageLoader.component';

@Component({
  selector: 'app-add-shop',
  templateUrl: './addShop.component.html',
  styleUrls: [],
})

export class AddShopComponent implements OnInit {

  isDataReady = false;

  type: any;

  shop = {
    name: '',
    link: '',
    logo: '',
    description: ''
  };

  marketplace = {
    name: '',
    logo: '',
    hasShops: false,
    searchTag: '',
    parser: '',
    shops: []
  };

  existedShopGroups: any;
  existedMarketplaces: any;
  newShopGroup = {
    name: ''
  };

  selectedShopGroups = [];
  selectedShopGroup: any;
  selectedMarketplace: any;


  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const observables = [];
    observables.push(this.restService.getShopGroups());
    observables.push(this.restService.getMarketplaces());

    Observable.forkJoin(observables).subscribe(
      resp => {
        this.existedShopGroups = resp[0];
        this.existedMarketplaces = resp[1];
        for (let i = 0; i < this.existedMarketplaces.length; i++) {
          if (this.existedMarketplaces[i].hasShops === false) {
            this.existedMarketplaces.splice(i, 1);
          }
        }
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
  }

  addShopToShopGroup () {
    let existed = false;
    for (let j = 0; j < this.selectedShopGroups.length; j++) {
      if (this.selectedShopGroups[j]._id === this.selectedShopGroup) {
        existed = true;
      }
    }

    if (!existed) {
      for (let i = 0; i < this.existedShopGroups.length; i++) {
        if (this.existedShopGroups[i]._id === this.selectedShopGroup) {

          this.selectedShopGroups.push(this.existedShopGroups[i]);
          this.selectedShopGroups = this.selectedShopGroups.slice();
          break;
        }
      }
    }
  }

  removeShopFromShopGroup (shopGroup_id: string) {
    for (let i = 0; i < this.selectedShopGroups.length; i++) {
      if (this.selectedShopGroups[i]._id === shopGroup_id) {

        this.selectedShopGroups.splice(i, 1);
        this.selectedShopGroups = this.selectedShopGroups.slice();
        break;
      }
    }
  }


  addShopGroup() {
    if (this.newShopGroup.name !== '' && this.newShopGroup.name !== undefined) {
        this.restService.createShopGroup(this.newShopGroup).subscribe(
          response => {
            this.getData();
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
  }

  removeLogo() {
    this.shop.logo = '';
  }

  openUploader(e) {
    const file = e.target.files[0];
    if (/^image\/\w+/.test(file.type)) {
      const modalRef = this.modalService.open(ImageLoaderComponent, {size: 'lg'});
      modalRef.componentInstance.imageURL = URL.createObjectURL(file);
      modalRef.result.then(
        (image) => {
          this.shop.logo = image._id;
          e.target.value = null;
        },
        () => {
          e.target.value = null;
        }
      );
     }
  }

  clickSave() {


    if (this.type === undefined || this.type === '') {
      window.alert('Select type!');
      return;
    }

    if (this.shop.name === undefined || this.shop.name === '') {
      window.alert('Name is not defined.');
      return;
    }

    if (this.type === 'standalone') {

      if (this.marketplace.searchTag === undefined || this.marketplace.searchTag === '') {
        window.alert('Search Tag is not defined.');
        return;
      }

      if (this.marketplace.parser === undefined || this.marketplace.parser === '') {
        window.alert('Parser path is not defined.');
        return;
      }

      this.marketplace.name = this.shop.name;
      this.marketplace.logo = this.shop.logo;
      this.restService.createShop(this.shop).subscribe(
        response => {
          this.shop = response;
          this.restService.updateShopShopGroups(this.selectedShopGroups, response._id).subscribe(
            resp1 => {
              this.marketplace.shops.push(response._id);
              this.restService.createMarketplace(this.marketplace).subscribe(
                resp2 => {
                  this.router.navigate(['/shops']);
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
      });

    } else {
      this.restService.createShop(this.shop).subscribe(
        response => {
          this.shop = response;
          this.restService.updateShopShopGroups(this.selectedShopGroups, response._id).subscribe(
            resp1 => {
              this.restService.addShopToMarketplace(this.selectedMarketplace, response._id).subscribe(
                resp2 => {
                  this.router.navigate(['/shops']);
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
      });
    }
  }

  clickCancel() {
    this.router.navigate(['/shops']);
  }

}
