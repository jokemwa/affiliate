import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { SelectBrandComponent } from '../brands/childs/selectBrand/selectBrand.component';


@Component({
  selector: 'app-top-navigation-menus',
  templateUrl: './topNavigationMenus.component.html',
  styleUrls: [],
})

export class TopNavigationMenusComponent implements OnInit {

  isDataReady = false;  
  topNavBrands: any;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    const observables = [];
    observables.push(this.restService.getBrandsMenu());
    Observable.forkJoin(observables).subscribe(
      response => {
        this.topNavBrands = response[0];
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
      }
    );
  }

  getBrandsMenu() {
    this.restService.getBrandsMenu().subscribe(
      response => {
          this.topNavBrands = response;
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

  checkBrands (allBrands, alreadySelected) {
    return new Promise ((resolve, rejet) => {
      const checkedList = [];
      for (let i = 0; i < allBrands.length; i++) {
        let isFound = false;
        for (let j = 0; j < alreadySelected.length; j++) {
          if (alreadySelected[j].brand._id === allBrands[i]._id) {
              isFound = true;
          }
        }
        if (isFound === false) {
          checkedList.push(allBrands[i]);
        }
      }
      resolve(checkedList);
    });
  }

  addBrand() {
    this.restService.getBrands().subscribe(
      response => {
        this.checkBrands(response, this.topNavBrands.items).then((checkedList) => {
          const modalRef = this.modalService.open(SelectBrandComponent, {size: 'lg'});
          modalRef.componentInstance.brands = checkedList;
          modalRef.result.then((brand_id) => {
            this.restService.addBrandToMenu(brand_id).subscribe(
              resp => {
                this.getBrandsMenu();
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
    this.restService.updateBrandsMenu(this.topNavBrands).subscribe(
      response => {
        this.getBrandsMenu();
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

  removeBrand(brand_id) {
    this.restService.removeBrandFromMenu(brand_id).subscribe(
      response => {
        this.getBrandsMenu();
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

      for (let i = 0; i < this.topNavBrands.items.length; i++) {
        if (this.topNavBrands.items[i]._id === _id) {
          currentOrder = this.topNavBrands.items[i].order;
          for (let j = 0; j < this.topNavBrands.items.length; j++) {
            if (this.topNavBrands.items[j].order === (currentOrder - 1)) {
              this.topNavBrands.items[j].order = currentOrder;
              break;
            }
          }
          this.topNavBrands.items[i].order--;
          break;
        }
      }

      this.topNavBrands.items = this.topNavBrands.items.slice();
    }
  }

  moveDown (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isLast(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.topNavBrands.items.length; i++) {
        if (this.topNavBrands.items[i]._id === _id) {
          currentOrder = this.topNavBrands.items[i].order;
          for (let j = 0; j < this.topNavBrands.items.length; j++) {
            if (this.topNavBrands.items[j].order === (currentOrder + 1)) {
              this.topNavBrands.items[j].order = currentOrder;
              break;
            }
          }
          this.topNavBrands.items[i].order++;
          break;
        }
      }

      this.topNavBrands.items = this.topNavBrands.items.slice();

    }
  }

  isLast (_id) {
    let maxOrder = this.topNavBrands.items[0].order;
    let maxId = this.topNavBrands.items[0]._id;
    for (let i = 0; i < this.topNavBrands.items.length; i++) {
      if (this.topNavBrands.items[i].order > maxOrder) {
        maxOrder = this.topNavBrands.items[i].order;
        maxId = this.topNavBrands.items[i]._id;
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
    for (let i = 0; i < this.topNavBrands.items.length; i++) {
      if (this.topNavBrands.items[i].order === 0) {
        minId = this.topNavBrands.items[i]._id;
        break;
      }
    }
    if (minId === _id) {
      return true;
    } else {
      return false;
    }
  }

}
