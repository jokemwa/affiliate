import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-new-category',
  templateUrl: './newCategory.component.html',
  styleUrls: [],
})

export class NewCategoryComponent {

  category = {name: '', description: ''};

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService) {}

  clickSave (name, description) {
    if (name !== undefined && name !== '') {
      this.category.name = name;
      this.category.description = description;
      this.restService.createCategory(this.category).subscribe(
        response => {
          this.activeModal.close('Created');
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
