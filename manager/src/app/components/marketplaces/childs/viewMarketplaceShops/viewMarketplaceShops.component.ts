import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { DeleteShopComponent } from '../../../shops/childs/deleteShop/deleteShop.component';

@Component({
  selector: 'app-view-marketplace-shops',
  templateUrl: './viewMarketplaceShops.component.html',
  styleUrls: [],
})

export class VievMarketplaceShopsComponent implements OnInit {

  isDataReady = false;

  marketplace: any;


  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getMarketplaceShops(params.get('_id')))
    .subscribe(response => {
      this.marketplace = response;
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

  getMarketplaceData () {
    this.restService.getMarketplaceShops(this.marketplace._id).subscribe(
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
    });
  }

  newShop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/marketplaces/' + this.marketplace._id + '/shops/add']);
  }

  editShop(shop_id) {
    this.router.navigate(['/shops/' + shop_id + '/edit']);
  }

  viewShopProducts(shop_id) {
    this.router.navigate(['/shops/' + shop_id + '/products']);
  }

  deleteShop(shop_id) {
    for (let i = 0; i < this.marketplace.shops.length; i++) {
      if (this.marketplace.shops[i]._id === shop_id) {
        if (this.marketplace.shops[i].items.length === 0) {
          const modalRef = this.modalService.open(DeleteShopComponent, {size: 'sm'});
          modalRef.componentInstance._id = shop_id;
          modalRef.result.then(
            () => {
              this.getMarketplaceData();
            },
            () => {}
          );
        } else {
          window.alert('Shop has products!');
        }
        break;
      }
    }
  }


}
