import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { AddProductComponent } from '../products/childs/addProduct/addProduct.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './mainMenu.component.html',
  styleUrls: []
})
export class MainMenuComponent implements OnInit {
  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  brokenLinks: any;
  isDataReady = false;

  ngOnInit(): void {
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

  addProduct(e) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(AddProductComponent, {size: 'lg'});

  }

}
