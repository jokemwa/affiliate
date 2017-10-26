import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';


import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-delete-category',
  templateUrl: './deleteCategory.component.html',
  styleUrls: [],
})

export class DeleteCategoryComponent implements OnInit {

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

  clickOk () {
    this.restService.deleteCategory(this._id).subscribe(
      response => {
        this.activeModal.close('Deleted');
      },
      err => {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  clickCancel () {
    this.activeModal.dismiss();
  }

}
