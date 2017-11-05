import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { NewBadgeComponent } from './childs/newBadge/newBadge.component';
import { EditBadgeComponent } from './childs/editBadge/editBadge.component';
import { DeleteBadgeComponent } from './childs/deleteBadge/deleteBadge.component';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: [],
})

export class BadgesComponent implements OnInit {

  badges: any;

  isDataReady = false;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.getBadges();
  }

  getBadges() {
    this.restService.getBadgesWithProducts().subscribe(
      response => {
          this.badges = response;
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

  newBadge(e) {
    e.stopPropagation();
    e.preventDefault();
    const modalRef = this.modalService.open(NewBadgeComponent, {size: 'lg'});
    modalRef.result.then(
      () => {
        this.getBadges();
      },
      () => {}
    );
  }

  editBadge (_id) {
    const modalRef = this.modalService.open(EditBadgeComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getBadges();
      },
      () => {}
    );
  }


  deleteBadge (_id) {
    const modalRef = this.modalService.open(DeleteBadgeComponent, {size: 'sm'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(
      () => {
        this.getBadges();
      },
      () => {}
    );
  }

  viewBadgeProducts(badge_id) {
    this.router.navigate(['/badge/' + badge_id]);
  }

}
