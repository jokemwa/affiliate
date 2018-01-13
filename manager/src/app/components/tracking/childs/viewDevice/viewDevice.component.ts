import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { ViewSessionComponent } from '../viewSession/viewSession.component';

@Component({
  selector: 'app-view-device',
  templateUrl: './viewDevice.component.html',
  styleUrls: [],
})

export class ViewDeviceComponent implements OnInit {

  isDataReady = false;

  device: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.restService.getDevice(params.get('_id')))
    .subscribe(response => {
      this.device = response;
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

  viewSession(_id: string) {
    const modalRef = this.modalService.open(ViewSessionComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
  }
}
