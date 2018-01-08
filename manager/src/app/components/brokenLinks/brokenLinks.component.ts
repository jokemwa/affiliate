import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { RESTService } from '../../services/rest.service';

import { DeleteProductComponent } from '../products/childs/deleteProduct/deleteProduct.component';
import { ProductPreviewComponent } from '../products/childs/productPreview/productPreview.component';

@Component({
  selector: 'app-broken-links',
  templateUrl: './brokenLinks.component.html',
  styleUrls: [],
})

export class BrokenLinksComponent implements OnInit {

  isDataReady = false;
  brokenLinks: any;


  constructor(
    private restService: RESTService,
    public modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.getBrokenLinks();
  }

  getBrokenLinks() {
    this.restService.getBrokenLinks().subscribe(
      response => {
          this.brokenLinks = response;
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


  deleteProduct(_id: string) {
    const modalRef = this.modalService.open(DeleteProductComponent, {size: 'sm'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getBrokenLinks();
      },
      () => {}
    );
  }

  removeLink(_id: string) {
    this.restService.removeBrokenLink(_id).subscribe(
      response => {
          this.brokenLinks = response;
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

  productPreview (e, product_id) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
    modalRef.componentInstance._id = product_id;
  }


}
