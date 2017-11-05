import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-delete-marketplace',
  templateUrl: './deleteMarketplace.component.html',
  styleUrls: [],
})

export class DeleteMarketplaceComponent implements OnInit {

  isDataReady = false;

  @Input() _id;

  marketplace: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  ngOnInit(): void {
    this.getMarketplaceData();
  }

  getMarketplaceData () {
    this.restService.getMarketplace(this._id).subscribe(
      response => {
          this.marketplace = response;
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
    this.restService.deleteMarketplace(this._id).subscribe(
      response => {
        this.activeModal.close('Deleted');
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

  clickCancel () {
    this.activeModal.dismiss();
  }

}
