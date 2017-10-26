import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RESTService } from '../../../services/rest.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
  styleUrls: [],
})

export class ChangePasswordComponent {

  model: any = {};
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private restService: RESTService) {

    }


  change() {
    if (this.model.newPw === this.model.newPwAgain) {
      this.loading = true;
      this.restService.changePassowrd(this.model.oldPw, this.model.newPw).subscribe(
        response => {
          window.alert ('Password changed.');
          this.router.navigate(['/']);
        },
        err => {
          this.error = 'Old password is incorrect';
          this.loading = false;
      });
    } else {
      window.alert ('New passwords do not match!');
    }
  }
}
