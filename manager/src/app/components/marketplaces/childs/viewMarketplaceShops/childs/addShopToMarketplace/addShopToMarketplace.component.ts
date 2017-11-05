import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../../../services/rest.service';
import { ImageLoaderComponent } from '../../../../../imageLoader/imageLoader.component';

@Component({
  selector: 'app-add-shop-to-marketplace',
  templateUrl: './addShopToMarketplace.component.html',
  styleUrls: [],
})

export class AddShopToMarketplaceComponent implements OnInit {

  isDataReady = false;

  marketplace: any;

  uploadedLogo = null;

  shop = {
    name: '',
    link: '',
    logo: '',
    description: ''
  };

  existedShopGroups = [];
  newShopGroup = {
    name: ''
  };

  selectedShopGroups = [];
  selectedShopGroup: any;


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

      this.restService.createShop(this.shop).subscribe(
        response => {
          this.shop = response;
          this.restService.updateShopShopGroups(this.selectedShopGroups, response._id).subscribe(
            resp1 => {
              this.marketplace.shops.push(response._id);
              this.restService.updateMarketplace(this.marketplace).subscribe(
                resp2 => {
                  this.router.navigate(['/marketplaces/' + this.marketplace._id + '/shops']);
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
