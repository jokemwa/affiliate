import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubscribeResultComponent } from './childs/subscribeResult/subscribeResult.component';

import { RESTService } from '../../services/rest.service';
import { TranslationService } from '../../services/translation.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: []
})
export class FooterComponent implements OnInit {

  translation: any;

  subscribeEmail: any;

  EMAIL_REGEX = '[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*';

  constructor(
    private modalService: NgbModal,
    private translationService: TranslationService,
    private restService: RESTService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.translation = this.translationService.translation;
  }

  clickFacebook(e) {
    e.stopPropagation();
    e.preventDefault();
    window.open(this.translation.topNavigation.facebookLink, '_blank');
  }

  clickYoutube(e) {
    e.stopPropagation();
    e.preventDefault();
    window.open(this.translation.topNavigation.youtubeLink, '_blank');
  }

  clickEmail(e) {
    e.stopPropagation();
    e.preventDefault();
    window.open('mailto:' + this.translation.footer.contactEmail, '_blank');
  }

  clickSubscribe() {
    this.restService.subscribeEmail(this.subscribeEmail).subscribe(
      response => {
        const modalRef = this.modalService.open(SubscribeResultComponent, {size: 'sm'});
        modalRef.componentInstance.result = response;
      },
      err => {
        console.log(JSON.stringify(err));
    });
  }
}
