import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-edit-badge',
  templateUrl: './editBadge.component.html',
  styleUrls: [],
})

export class EditBadgeComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

  colors = [
    'badge-primary',
    'badge-secondary',
    'badge-success',
    'badge-danger',
    'badge-warning',
    'badge-info',
    'badge-light',
    'badge-dark'
  ];

  badge: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  ngOnInit(): void {
    this.getBadgeData();
  }

  getBadgeData () {
    this.restService.getBadge(this._id).subscribe(
      response => {
          this.badge = response;
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

  setColor(color: string) {
    this.badge.color = color;
  }

  clickSave () {
    if (this.badge.text !== undefined && this.badge.text !== '') {
      this.restService.updateBadge(this.badge).subscribe(
        response => {
          this.activeModal.close('Updated');
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
      window.alert('Badge Text is empty!');
    }
  }

  clickCancel () {
    this.activeModal.dismiss();
  }


}
