import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RESTService } from '../../../services/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [],
})

export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private restService: RESTService) {}

  ngOnInit(): void {
    this.restService.logout();
  }

  login() {
    this.loading = true;
    this.restService.login(this.model.username, this.model.password)
    .then((result) => {
      if (result === true) {
        // login successful
        this.router.navigate(['/']);
      } else {
        // login failed
        this.error = 'Username or password is incorrect';
        this.loading = false;
      }
    });
  }

}
