import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { SelectShopComponent } from '../../../shops/childs/selectShop/selectShop.component';

@Component({
  selector: 'app-view-shopgroup-shops',
  templateUrl: './viewShopGroupShops.component.html',
  styleUrls: [],
})

export class ViewShopGroupShopsComponent implements OnInit {

  isDataReady = false;

  shopGroup: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getShopGroup(params.get('_id')))
    .subscribe(response => {
      this.shopGroup = response;
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

  getShopGroupData () {
    this.restService.getShopGroup(this.shopGroup._id).subscribe(
      response => {
          this.shopGroup = response;
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

  moveUp (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isFirst(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.shopGroup.items.length; i++) {
        if (this.shopGroup.items[i]._id === _id) {
          currentOrder = this.shopGroup.items[i].order;
          for (let j = 0; j < this.shopGroup.items.length; j++) {
            if (this.shopGroup.items[j].order === (currentOrder - 1)) {
              this.shopGroup.items[j].order = currentOrder;
              break;
            }
          }
          this.shopGroup.items[i].order--;
          break;
        }
      }

      this.shopGroup.items = this.shopGroup.items.slice();
    }
  }

  moveDown (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isLast(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.shopGroup.items.length; i++) {
        if (this.shopGroup.items[i]._id === _id) {
          currentOrder = this.shopGroup.items[i].order;
          for (let j = 0; j < this.shopGroup.items.length; j++) {
            if (this.shopGroup.items[j].order === (currentOrder + 1)) {
              this.shopGroup.items[j].order = currentOrder;
              break;
            }
          }
          this.shopGroup.items[i].order++;
          break;
        }
      }

      this.shopGroup.items = this.shopGroup.items.slice();

    }
  }

  isLast (_id) {
    let maxOrder = this.shopGroup.items[0].order;
    let maxId = this.shopGroup.items[0]._id;
    for (let i = 0; i < this.shopGroup.items.length; i++) {
      if (this.shopGroup.items[i].order > maxOrder) {
        maxOrder = this.shopGroup.items[i].order;
        maxId = this.shopGroup.items[i]._id;
      }
    }
    if (maxId === _id) {
      return true;
    } else {
      return false;
    }
  }

  isFirst (_id) {
    let minId;
    for (let i = 0; i < this.shopGroup.items.length; i++) {
      if (this.shopGroup.items[i].order === 0) {
        minId = this.shopGroup.items[i]._id;
        break;
      }
    }
    if (minId === _id) {
      return true;
    } else {
      return false;
    }
  }

  removeShop(shop_id) {
    this.restService.removeShopFromShopGroup(this.shopGroup._id, shop_id).subscribe(
      response => {
        this.getShopGroupData();
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

  checkShops (shopsList) {
    return new Promise ((resolve, rejet) => {
      const checkedList = [];
      for (let i = 0; i < shopsList.length; i++) {
        let isFound = false;
        for (let j = 0; j < this.shopGroup.items.length; j++) {
          if (this.shopGroup.items[j].shop._id === shopsList[i]._id) {
              isFound = true;
          }
        }
        if (isFound === false) {
          checkedList.push(shopsList[i]);
        }
      }
      resolve(checkedList);
    });
  }

  selectShop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.restService.getShops().subscribe(
      response => {
        this.checkShops(response).then((shopsList) => {
          const modalRef = this.modalService.open(SelectShopComponent, {size: 'lg'});
          modalRef.componentInstance.shops = shopsList;
          modalRef.result.then((shop_id) => {
            this.restService.addShopToShopGroup(this.shopGroup._id, shop_id).subscribe(
              resp => {
                this.getShopGroupData();
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
            () => {});
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

  saveChanges() {
    this.restService.updateShopGroup(this.shopGroup).subscribe(
      response => {
          this.router.navigate(['/shopgroups']);
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
