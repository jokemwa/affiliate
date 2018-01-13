import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../services/rest.service';

import { ViewSessionComponent } from './childs/viewSession/viewSession.component';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: [],
})

export class TrackingComponent implements OnInit {

  sessions: any;
  devices: any;
  isDataReady = false;

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router) {}


  ngOnInit(): void {
      const observables = [];
      observables.push(this.restService.getSessions());
      observables.push(this.restService.getDevices());
      Observable.forkJoin(observables).subscribe(
        response => {
          this.sessions = response[0];
          this.devices = response[1];
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
        }
      );
  }

  viewSession(_id: string) {
    const modalRef = this.modalService.open(ViewSessionComponent, {size: 'lg'});
    modalRef.componentInstance._id = _id;
  }

  viewDevice(_id: string) {
    this.router.navigate(['/tracking/' + _id]);
  }



}
