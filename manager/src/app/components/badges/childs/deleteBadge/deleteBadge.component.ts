import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-delete-badge',
  templateUrl: './deleteBadge.component.html',
  styleUrls: [],
})

export class DeleteBadgeComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

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

  clickOk () {
    this.restService.deleteBadge(this._id).subscribe(
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
