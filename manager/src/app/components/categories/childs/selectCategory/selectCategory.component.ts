import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';


import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-select-category',
  templateUrl: './selectCategory.component.html',
  styleUrls: [],
})

export class SelectCategoryComponent implements OnInit {


  @Input() categories;

  searchText: string;

  searchResults = [];

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService) {}

  ngOnInit(): void {
    this.searchResults = this.categories;
  }

  search () {
    this.searchResults = [];
    for (let i = 0; i < this.categories.length; i++) {
      const element = this.categories[i].name.toLowerCase();
      if (element.indexOf(this.searchText.toLowerCase()) >= 0) {
        this.searchResults.push(this.categories[i]);
      }
    }
    this.searchResults = this.searchResults.slice();
  }

  selectCategory(e, category_id) {
    e.stopPropagation();
    e.preventDefault();
    this.activeModal.close(category_id);
  }

  clickCancel () {
    this.activeModal.dismiss();
  }

}
