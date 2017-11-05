import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { DeleteTagComponent } from './childs/deleteTag/deleteTag.component';
import { NewTagComponent } from './childs/newTag/newTag.component';
import { EditTagComponent } from './childs/editTag/editTag.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: [],
})

export class TagsComponent implements OnInit {

  tags: any;

  isDataReady = false;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.getTags();
  }

  getTags() {
    this.restService.getTags().subscribe(
      response => {
          this.tags = response;
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

  newTag(e) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(NewTagComponent, {size: 'sm'});
    modalRef.result.then(
      () => {
        this.getTags();
      },
      () => {}
    );
  }

  editTag (_id) {
    const modalRef = this.modalService.open(EditTagComponent, {size: 'sm'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getTags();
      },
      () => {}
    );
  }


  deleteTag (_id) {

    const modalRef = this.modalService.open(DeleteTagComponent, {size: 'sm'});
    modalRef.componentInstance._id = _id;
      modalRef.result.then(
        () => {
          this.getTags();
        },
        () => {}
      );
  }

  viewTagProducts(_id) {
    this.router.navigate(['/tags/' + _id + '/products']);
  }

}


