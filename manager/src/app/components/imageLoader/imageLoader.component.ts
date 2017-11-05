import { Component, Input, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { RESTService } from '../../services/rest.service';

declare var Croppie: any;

@Component({
  selector: 'app-image-loader',
  templateUrl: './imageLoader.component.html',
  styleUrls: [],
})

export class ImageLoaderComponent implements AfterViewInit {

  @Input() imageURL;

  cropper: any;

  constructor(
    private sanitizer: DomSanitizer,
    private restService: RESTService,
    private router: Router,
    public activeModal: NgbActiveModal
  ) {}

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngAfterViewInit(): void {
    this.cropper = new Croppie(document.getElementById('targetImage'), {
      viewport: {
          width: 128,
          height: 128,
          type: 'square',
      },
      enableOrientation: true,
      enableResize: true,
      showZoomer: false
  });
  }

  clickCrop() {
    this.cropper.result({
      type: 'blob',
      size: 'viewport',
      format: 'jpeg'
    }).then( (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'tmp');
      this.restService.sendFile(formData).subscribe(
        response => {
          this.activeModal.close(response);
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
    });
  }

  clickCancel() {
    this.activeModal.dismiss();
  }
}
