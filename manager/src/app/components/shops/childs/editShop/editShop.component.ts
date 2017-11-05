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
  selector: 'app-edit-shop',
  templateUrl: './editShop.component.html',
  styleUrls: [],
})

export class EditShopComponent implements OnInit {

  isDataReady = false;

  marketplace: any;

  shop: any;

  uploadedLogo: any;

  selectedShopGroups: any;
  selectedShopGroup: any;

  existedShopGroups: any;
  newShopGroup = {
    name: ''
  };



  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getShop(params.get('_id')))
    .subscribe(response => {
          this.shop = response;

          const observables = [];
          observables.push(this.restService.getShopShopGroups(response._id));
          observables.push(this.restService.getShopMarketplace(response._id));
          Observable.forkJoin(observables).subscribe(
            resp => {
              this.marketplace = resp[1];
              this.selectedShopGroups = resp[0];
              this.getShopGroups();
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


  getShopGroups() {
    this.restService.getShopGroups().subscribe(
      response => {
          this.existedShopGroups = response;
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
            this.getShopGroups();
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
    if (this.uploadedLogo) {
      this.restService.deleteImage(this.uploadedLogo).subscribe(
        response => {
          this.uploadedLogo = null;
          this.shop.logo = '';
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
      this.shop.logo = '';
    }
  }

  openUploader(e) {
    const file = e.target.files[0];
    if (/^image\/\w+/.test(file.type)) {
      const modalRef = this.modalService.open(ImageLoaderComponent, {size: 'lg'});
      modalRef.componentInstance.imageURL = URL.createObjectURL(file);
      modalRef.result.then(
        (image) => {
          if (this.uploadedLogo) {
            this.restService.deleteImage(this.uploadedLogo).subscribe(
              response => {
                this.uploadedLogo = image._id;
                this.shop.logo = this.uploadedLogo;
                e.target.value = null;
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
            this.uploadedLogo = image._id;
            this.shop.logo = this.uploadedLogo;
            e.target.value = null;
          }
        },
        () => {
          e.target.value = null;
        }
      );
     }
  }

  clickSave() {

    if (this.shop.name === undefined || this.shop.name === '') {
      window.alert('Name is not defined.');
      return;
    }

    if (this.marketplace.hasShops === false) {

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
      this.restService.updateShop(this.shop).subscribe(
        response => {
          this.shop = response;
          this.restService.updateShopShopGroups(this.selectedShopGroups, response._id).subscribe(
            resp1 => {
              this.marketplace.shops.push(response._id);
              this.restService.updateMarketplace(this.marketplace).subscribe(
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
      this.restService.updateShop(this.shop).subscribe(
        response => {
          this.shop = response;
          this.restService.updateShopShopGroups(this.selectedShopGroups, response._id).subscribe(
            resp1 => {
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
    }
  }

  clickCancel() {
    if (this.uploadedLogo) {
      this.restService.deleteImage(this.uploadedLogo).subscribe(
        response => {
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
    } else {
      this.router.navigate(['/shops']);
    }
  }
}
