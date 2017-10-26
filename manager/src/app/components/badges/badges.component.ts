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
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
    });
  }

  newBadge(e) {
    e.stopPropagation();
    e.preventDefault();
    const _this = this;
    const modalRef = this.modalService.open(NewBadgeComponent, {size: 'lg'});
    modalRef.result.then(function(){
      _this.getBadges();
    }, function(){});
  }

  editBadge (_id) {
    const _this = this;
    const modalRef = this.modalService.open(EditBadgeComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(function(){
    _this.getBadges();
    }, function(){});
  }


  deleteBadge (_id) {
    const _this = this;
    const modalRef = this.modalService.open(DeleteBadgeComponent, {size: 'sm'});
    modalRef.componentInstance._id = _id;
    modalRef.result.then(function(){
      _this.getBadges();
      }, function(){});
  }

  viewBadgeProducts(badge_id) {
    this.router.navigate(['/badge/' + badge_id]);
  }

}
