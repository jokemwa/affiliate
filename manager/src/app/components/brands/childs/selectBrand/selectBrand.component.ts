import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';


import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-select-brand',
  templateUrl: './selectBrand.component.html',
  styleUrls: [],
})

export class SelectBrandComponent implements OnInit {


  @Input() brands;

  searchText: string;

  searchResults = [];

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService) {}

  ngOnInit(): void {
    this.searchResults = this.brands;
  }

  search () {
    this.searchResults = [];
    for (let i = 0; i < this.brands.length; i++) {
      const element = this.brands[i].name.toLowerCase();
      if (element.indexOf(this.searchText.toLowerCase()) >= 0) {
        this.searchResults.push(this.brands[i]);
      }
    }
    this.searchResults = this.searchResults.slice();
  }

  selectBrand(e, brand_id) {
    e.stopPropagation();
    e.preventDefault();
    this.activeModal.close(brand_id);
  }

  clickCancel () {
    this.activeModal.dismiss();
  }

}
