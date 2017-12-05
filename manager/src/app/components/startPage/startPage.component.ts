import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { SelectProductComponent } from '../products/childs/selectProduct/selectProduct.component';
import { ProductPreviewComponent } from '../products/childs/productPreview/productPreview.component';
import { EditProductComponent } from '../products/childs/editProduct/editProduct.component';
import { SelectCategoryComponent } from '../categories/childs/selectCategory/selectCategory.component';
import { ImageLoaderComponent } from '../imageLoader/imageLoader.component';


@Component({
  selector: 'app-start-page',
  templateUrl: './startPage.component.html',
  styleUrls: [],
})

export class StartPageComponent implements OnInit {

  isDataReady = false;
  uploadedImage = null;

  tops: any;
  topCategories: any;
  message: any;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    const observables = [];
    observables.push(this.restService.getTopCategories());
    observables.push(this.restService.getTops());
    observables.push(this.restService.getMarketingMessage());
    Observable.forkJoin(observables).subscribe(
      response => {
        this.topCategories = response[0];
        this.tops = response[1];
        this.message = response[2];
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


  getTops() {
    this.restService.getTops().subscribe(
      response => {
          this.tops = response;
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

  getTopCategories() {
    this.restService.getTopCategories().subscribe(
      response => {
          this.topCategories = response;
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

  checkProducts (allProducts, alreadySelected) {
    return new Promise ((resolve, rejet) => {
      const checkedList = [];
      for (let i = 0; i < allProducts.length; i++) {
        let isFound = false;
        for (let j = 0; j < alreadySelected.length; j++) {
          if (alreadySelected[j].product._id === allProducts[i]._id) {
              isFound = true;
          }
        }
        if (isFound === false) {
          checkedList.push(allProducts[i]);
        }
      }
      resolve(checkedList);
    });
  }

  showSelectTopProductDialog(e) {
    this.restService.getProducts().subscribe(
      response => {
        this.checkProducts(response, this.tops.items).then((checkedList) => {
          const modalRef = this.modalService.open(SelectProductComponent, {size: 'lg'});
          modalRef.componentInstance.products = checkedList;
          modalRef.result.then((product_id) => {
            this.restService.addProductToTops(product_id).subscribe(
              resp => {
                this.getTops();
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

  checkCategories (allCategories, alreadySelected) {
    return new Promise ((resolve, rejet) => {
      const checkedList = [];
      for (let i = 0; i < allCategories.length; i++) {
        let isFound = false;
        for (let j = 0; j < alreadySelected.length; j++) {
          if (alreadySelected[j].category.category._id === allCategories[i]._id) {
              isFound = true;
          }
        }
        if (isFound === false) {
          checkedList.push(allCategories[i]);
        }
      }
      resolve(checkedList);
    });
  }

  addTopCategory(e) {
    e.stopPropagation();
    e.preventDefault();
    this.restService.getCategories().subscribe(
      response => {
        this.checkCategories(response, this.topCategories.items).then((checkedList) => {
          const modalRef = this.modalService.open(SelectCategoryComponent, {size: 'lg'});
          modalRef.componentInstance.categories = checkedList;
          modalRef.result.then((category_id) => {
            this.restService.addTopCategory(category_id).subscribe(
              resp => {
                this.getTopCategories();
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

  showSelectProductDialog(e, topCategory_id, category_id) {
    for (let i = 0; i < this.topCategories.items.length; i++) {
      if (this.topCategories.items[i].category._id === topCategory_id) {
        this.restService.getCategory(category_id).subscribe(
          response => {
            const categoryProducts = [];
            response.items.forEach(element => {
              categoryProducts.push(element.product);
            });
            this.checkProducts(categoryProducts, this.topCategories.items[i].category.items).then((checkedList) => {
              const modalRef = this.modalService.open(SelectProductComponent, {size: 'lg'});
              modalRef.componentInstance.products = checkedList;
              modalRef.result.then((product_id) => {
                this.restService.addProductToTopCategory(topCategory_id, product_id).subscribe(
                  resp => {
                    this.getTopCategories();
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
    }
  }

  productPreview (_id: string) {
    const modalRef = this.modalService.open(ProductPreviewComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
  }

  editProduct(_id: string) {
    const modalRef = this.modalService.open(EditProductComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getTopCategories();
        this.getTops();
      },
      () => {}
    );
  }

  updateTops(topList) {
    this.tops.items = topList;
    this.restService.updateTops(this.tops).subscribe(
      response => {
        this.getTops();
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

  removeProductFromTops(product_id) {
    this.restService.removeProductFromTops(product_id).subscribe(
      response => {
        this.getTops();
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

  removeProductFromTopCategory(product_id, category_id) {
    this.restService.removeProductFromTopCategory(category_id, product_id).subscribe(
      response => {
        this.getTopCategories();
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

  updateTopCategory(productList, category_id) {
    for (let i = 0; i < this.topCategories.items.length; i++) {
      if (this.topCategories.items[i].category._id === category_id) {
        this.topCategories.items[i].items = productList;
        this.restService.updateTopCategory(this.topCategories.items[i].category).subscribe(
          response => {
            this.getTopCategories();
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
  }

  removeTopCategory(category_id) {
    this.restService.removeTopCategory(category_id).subscribe(
      response => {
        this.getTopCategories();
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

  updateMarketingMessage() {
    if (this.message.text  === undefined || this.message.text === '') {
      window.alert('Marketing Message Text is empty!');
      return;
    }

    this.restService.updateMarketingMessage(this.message).subscribe(
      response => {
        window.alert('Marketing Message updated.');
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

  openUploader(e) {
    const file = e.target.files[0];
    if (/^image\/\w+/.test(file.type)) {
      const modalRef = this.modalService.open(ImageLoaderComponent, {size: 'lg'});
      modalRef.componentInstance.imageURL = URL.createObjectURL(file);
      modalRef.result.then(
        (image) => {
          if (this.uploadedImage) {
            this.restService.deleteImage(this.uploadedImage).subscribe(
              response => {
                this.uploadedImage = image._id;
                this.message.image = this.uploadedImage;
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
            this.uploadedImage = image._id;
            this.message.image = this.uploadedImage;
            e.target.value = null;
          }
        },
        () => {
          e.target.value = null;
        }
      );
     }
  }

  moveUp (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isFirst(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.topCategories.items.length; i++) {
        if (this.topCategories.items[i].category._id === _id) {
          currentOrder = this.topCategories.items[i].order;
          for (let j = 0; j < this.topCategories.items.length; j++) {
            if (this.topCategories.items[j].order === (currentOrder - 1)) {
              this.topCategories.items[j].order = currentOrder;
              break;
            }
          }
          this.topCategories.items[i].order--;
          break;
        }
      }

      this.topCategories.items = this.topCategories.items.slice();
    }
  }

  moveDown (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isLast(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.topCategories.items.length; i++) {
        if (this.topCategories.items[i].category._id === _id) {
          currentOrder = this.topCategories.items[i].order;
          for (let j = 0; j < this.topCategories.items.length; j++) {
            if (this.topCategories.items[j].order === (currentOrder + 1)) {
              this.topCategories.items[j].order = currentOrder;
              break;
            }
          }
          this.topCategories.items[i].order++;
          break;
        }
      }

      this.topCategories.items = this.topCategories.items.slice();

    }
  }

  isLast (_id) {
    let maxOrder = this.topCategories.items[0].order;
    let maxId = this.topCategories.items[0].category._id;
    for (let i = 0; i < this.topCategories.items.length; i++) {
      if (this.topCategories.items[i].order > maxOrder) {
        maxOrder = this.topCategories.items[i].order;
        maxId = this.topCategories.items[i].category._id;
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
    for (let i = 0; i < this.topCategories.items.length; i++) {
      if (this.topCategories.items[i].order === 0) {
        minId = this.topCategories.items[i].category._id;
        break;
      }
    }
    if (minId === _id) {
      return true;
    } else {
      return false;
    }
  }

  saveTopCategoriesOrder() {
    this.restService.updateTopCategories(this.topCategories).subscribe(
      response => {
        window.alert('Categories Order updated.');
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
