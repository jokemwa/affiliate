import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddProductComponent } from '../products/childs/addProduct/addProduct.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './mainMenu.component.html',
  styleUrls: []
})
export class MainMenuComponent {
  constructor(
    private modalService: NgbModal
  ) {}

  addProduct(e) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(AddProductComponent, {size: 'lg'});

  }

}
