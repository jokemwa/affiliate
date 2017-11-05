import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { RESTService } from '../../../../services/rest.service';


@Component({
  selector: 'app-new-badge',
  templateUrl: './newBadge.component.html',
  styleUrls: [],
})

export class NewBadgeComponent {

  badge = {text: '', color: 'badge-light'};

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

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RESTService,
    private router: Router) {}

  setColor(color: string) {
    this.badge.color = color;
  }

  clickSave () {
    if (this.badge.text !== undefined && this.badge.text !== '') {
      this.restService.createBadge(this.badge).subscribe(
        response => {
          this.activeModal.close('Created');
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
