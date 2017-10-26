import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';


import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-edit-category',
  templateUrl: './editCategory.component.html',
  styleUrls: [],
})

export class EditCategoryComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

  category: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService) {}

  ngOnInit(): void {
    this.getCategoryData();
  }

  getCategoryData () {
    this.restService.getCategory(this._id).subscribe(
      response => {
          this.category = response;
          this.isDataReady = true;
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  clickSave (name, description) {
    if (this.category.name !== undefined && this.category.name !== '') {
      this.restService.updateCategory(this.category).subscribe(
        response => {
          this.activeModal.close('Updated');
        },
        err => {
          window.alert(JSON.stringify(err));
          console.log(JSON.stringify(err));
      });
    } else {
      window.alert('Category Name is empty!');
    }
  }

  clickCancel () {
    this.activeModal.dismiss();
  }

}
