import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-products',
  templateUrl: './listProducts.component.html',
  styleUrls: [],
})

export class ListProductsComponent {

  @Input() items: any;

  @Output() onAddProduct = new EventEmitter<any>();
  @Output() onSaveChanges = new EventEmitter<any>();
  @Output() onProductClick = new EventEmitter<string>();
  @Output() onEditProduct = new EventEmitter<string>();
  @Output() onRemoveProduct = new EventEmitter<string>();

  constructor() {}

  addProduct() {
    this.onAddProduct.emit();
  }

  saveChanges() {
    this.onSaveChanges.emit(this.items);
  }

  productClick(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    this.onProductClick.emit(_id);
  }

  editProduct(_id) {
    this.onEditProduct.emit(_id);
  }

  removeProduct(_id) {
    this.onRemoveProduct.emit(_id);
  }

  moveUp (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isFirst(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i]._id === _id) {
          currentOrder = this.items[i].order;
          for (let j = 0; j < this.items.length; j++) {
            if (this.items[j].order === (currentOrder - 1)) {
              this.items[j].order = currentOrder;
              break;
            }
          }
          this.items[i].order--;
          break;
        }
      }

      this.items = this.items.slice();
    }
  }

  moveDown (e, _id) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isLast(_id)) {
      return;
    } else {
      let currentOrder;

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i]._id === _id) {
          currentOrder = this.items[i].order;
          for (let j = 0; j < this.items.length; j++) {
            if (this.items[j].order === (currentOrder + 1)) {
              this.items[j].order = currentOrder;
              break;
            }
          }
          this.items[i].order++;
          break;
        }
      }

      this.items = this.items.slice();

    }
  }

  isLast (_id) {
    let maxOrder = this.items[0].order;
    let maxId = this.items[0]._id;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].order > maxOrder) {
        maxOrder = this.items[i].order;
        maxId = this.items[i]._id;
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
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].order === 0) {
        minId = this.items[i]._id;
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
