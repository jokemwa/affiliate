import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { ImageLoaderComponent } from '../../../imageLoader/imageLoader.component';

@Component({
  selector: 'app-edit-marketplace',
  templateUrl: './editMarketplace.component.html',
  styleUrls: [],
})

export class EditMarketplaceComponent implements OnInit {

  isDataReady = false;

  marketplace: any;

  uploadedLogo = null;

  shop: any;

  selectedShopGroups = [];
  selectedShopGroup: any;

  existedShopGroups = [];
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
    .switchMap((params: ParamMap) => this.restService.getMarketplace(params.get('_id')))
    .subscribe(response => {
      this.marketplace = response;
      if (response.hasShops === false) {
        this.restService.getShop(response.shops[0])
        .subscribe(resp1 => {
          this.shop = resp1;
          this.restService.getShopShopGroups(resp1._id).subscribe(
            resp2 => {
              this.selectedShopGroups = resp2;
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
      });
      } else {
        this.isDataReady = true;
      }
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
          this.marketplace.logo = '';
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
      this.marketplace.logo = '';
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
                this.marketplace.logo = this.uploadedLogo;
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
            this.marketplace.logo = this.uploadedLogo;
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
    if (this.marketplace.searchTag === undefined || this.marketplace.searchTag === '') {
      window.alert('Search Tag is not defined.');
      return;
    }

    if (this.marketplace.parser === undefined || this.marketplace.parser === '') {
      window.alert('Parser path is not defined.');
      return;
    }

    if (this.marketplace.name === undefined || this.marketplace.name === '') {
      window.alert('Name is not defined.');
      return;
    }

    if (!this.marketplace.hasShops) {
      this.shop.name = this.marketplace.name;
      this.shop.logo = this.marketplace.logo;
      this.restService.updateShop(this.shop).subscribe(
        response => {
          this.shop = response;
          this.restService.updateShopShopGroups(this.selectedShopGroups, response._id).subscribe(
            resp1 => {
              this.restService.updateMarketplace(this.marketplace).subscribe(
                resp2 => {
                  this.router.navigate(['/marketplaces']);
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
      this.restService.updateMarketplace(this.marketplace).subscribe(
        response => {
          this.router.navigate(['/marketplaces']);
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
          this.router.navigate(['/marketplaces']);
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
      this.router.navigate(['/marketplaces']);
    }
  }

}
