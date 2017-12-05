import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RESTService } from '../../services/rest.service';


@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: [],
})

export class TranslationComponent implements OnInit {

  isDataReady = false;
  translation: any;

  constructor(
    private restService: RESTService,
    private router: Router,
    private location: Location) {}

  ngOnInit(): void {
      this.loadTranslation();
  }

  loadTranslation() {
    this.restService.loadTranslation().subscribe(
      response => {
          this.translation = response;
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

  saveTranslation() {

    this.restService.saveTranslation(this.translation).subscribe(
      response => {
          window.alert('Translation saved.');
          this.router.navigate(['/']);
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

  clickCancel() {
    this.location.back();
  }

}
