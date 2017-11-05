import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { DeleteMarketplaceComponent } from './childs/deleteMarketplace/deleteMarketplace.component';


@Component({
  selector: 'app-marketplaces',
  templateUrl: './marketplaces.component.html',
  styleUrls: [],
})

export class MarketplacesComponent implements OnInit {

  isDataReady = false;
  marketplaces: any;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMarketplaces();
  }

  getMarketplaces() {
    this.restService.getMarketplacesWithProducts().subscribe(
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
    });
  }

  newMarketplace(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/marketplaces/add']);
  }

  viewMarketplaceShops(_id: string) {
    this.router.navigate(['/marketplaces/' + _id + '/shops']);
  }

  viewMarketplaceProducts(_id: string) {
    this.router.navigate(['/marketplaces/' + _id + '/products']);
  }

  editMarketplace(_id: string) {
    this.router.navigate(['/marketplaces/' + _id + '/edit']);
  }

  deleteMarketplace(_id: string) {
    for (let i = 0; i < this.marketplaces.length; i++) {
      if (this.marketplaces[i]._id === _id) {
        if (this.marketplaces[i].products.length === 0) {
          const modalRef = this.modalService.open(DeleteMarketplaceComponent, {size: 'sm'});
          modalRef.componentInstance._id = _id;
          modalRef.result.then(
            () => {
              this.getMarketplaces();
            },
            () => {}
          );
        } else {
          window.alert('Marketplace has products!');
        }
        break;
      }
    }
  }

}
