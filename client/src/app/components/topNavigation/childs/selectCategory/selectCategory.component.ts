import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { orderBy } from 'lodash';

import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-select-category',
  templateUrl: './selectCategory.component.html',
  styleUrls: []
})
export class SelectCategoryComponent  implements OnInit {

  translation: any;

  categories: any;
  list = [];
  columnsList = [[], []];

  constructor(
    public activeModal: NgbActiveModal,
    private translationService: TranslationService,
    private router: Router) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;

    this.categories = orderBy(this.categories, 'name', 'asc');
    for (let i = 0; i < this.categories.length; i++) {
      if (this.list.length === 0) {
        const letterList = {
          letter: this.categories[i].name[0].toUpperCase(),
          categories: [this.categories[i]]
        };
        this.list.push(letterList);
        continue;
      }
      let letterExisted = false;
      for (let j = 0; j < this.list.length; j++) {
        if (this.categories[i].name[0] === this.list[j].letter) {
          this.list[j].categories.push(this.categories[i]);
          letterExisted = true;
          break;
        }
      }
      if (!letterExisted) {
        const letterList = {
          letter: this.categories[i].name[0].toUpperCase(),
          categories: [this.categories[i]]
        };
        this.list.push(letterList);
        continue;
      }
    }
    this.list = orderBy(this.list, 'letter', 'asc');
    this.list.forEach((element) => {
      element.categories = orderBy(element.categories, 'name', 'asc');
    });
    const columnHeight = ((this.categories.length + this.list.length) - (this.categories.length + this.list.length) % 2) / 2;
    let collector = 0;
    for (let i = 0; i < this.list.length; i++) {
      if (collector < columnHeight) {
        this.columnsList[0].push(this.list[i]);
        collector = collector + this.list[i].categories.length + 1;
      } else {
        this.columnsList[1].push(this.list[i]);
        collector = collector + this.list[i].categories.length + 1;
      }
    }
  }

  clickCategory(e, _id) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/category/' + _id]);
    this.activeModal.close();
  }


  cancel() {
    this.activeModal.dismiss();
  }

}
