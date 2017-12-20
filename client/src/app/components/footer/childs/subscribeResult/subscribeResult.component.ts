import { Component, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslationService } from '../../../../services/translation.service';


@Component({
  selector: 'app-subscribe-result',
  templateUrl: './subscribeResult.component.html',
  styleUrls: []
})
export class SubscribeResultComponent  implements OnInit {

  translation: any;

  result: any;

  message: 'success'; // success, alreadySubscribed

  constructor(
    public activeModal: NgbActiveModal,
    private translationService: TranslationService,
    private router: Router) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;
    this.message = this.result.message;
  }

  close() {
    this.activeModal.close();
  }

}
