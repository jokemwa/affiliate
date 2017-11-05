import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { DeleteBrandComponent } from './childs/deleteBrand/deleteBrand.component';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: [],
})

export class BrandsComponent implements OnInit {

  brands: any;

  isDataReady = false;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands() {
    this.restService.getBrands().subscribe(
      response => {
          this.brands = response;
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

  newBrand(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/brands/add']);
  }

  editBrand (_id) {
    this.router.navigate(['/brands/' + _id + '/edit']);
  }


  deleteBrand (_id) {
    for (let i = 0; i < this.brands.length; i++) {
      if (this.brands[i]._id === _id) {
        if (this.brands[i].items.length === 0) {
          const modalRef = this.modalService.open(DeleteBrandComponent, {size: 'sm'});
          modalRef.componentInstance._id = _id;
          modalRef.result.then(
            () => {
              this.getBrands();
            },
            () => {}
          );
        } else {
          window.alert('Brand has products!');
        }
        break;
      }
    }
  }

  viewBrandProducts(_id) {
    this.router.navigate(['/brands/' + _id + '/products']);
  }

}

