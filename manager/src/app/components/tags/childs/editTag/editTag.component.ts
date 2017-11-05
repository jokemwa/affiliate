import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-edit-tag',
  templateUrl: './editTag.component.html',
  styleUrls: [],
})

export class EditTagComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

  tag: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  ngOnInit(): void {
    this.getTagData();
  }

  getTagData () {
    this.restService.getTag(this._id).subscribe(
      response => {
          this.tag = response;
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
    });
  }

  clickSave () {
    if (this.tag.name !== undefined && this.tag.name !== '') {
      this.restService.updateTag(this.tag).subscribe(
        response => {
          this.activeModal.close('Created');
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
      window.alert('Category Name is empty!');
    }
  }

  clickCancel () {
    this.activeModal.dismiss();
  }

}
