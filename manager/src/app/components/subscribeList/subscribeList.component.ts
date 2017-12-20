import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RESTService } from '../../services/rest.service';


@Component({
  selector: 'app-subscribe-list',
  templateUrl: './subscribeList.component.html',
  styleUrls: [],
})

export class SubscribeListComponent implements OnInit {

  isDataReady = false;
  subscribeList: any;

  constructor(
    private restService: RESTService,
    private router: Router,
    private location: Location) {}

  ngOnInit(): void {
      this.loadSubscribeList();
  }

  loadSubscribeList() {
    this.restService.getSubscribeList().subscribe(
      response => {
          this.subscribeList = response;
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

  deleteSubscriber(_id) {

    this.restService.removeFromSubscribeList(_id).subscribe(
      response => {
          window.alert('Deleted.');
          this.loadSubscribeList();
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

}
