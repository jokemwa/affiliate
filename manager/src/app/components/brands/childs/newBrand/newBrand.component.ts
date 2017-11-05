import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from '../../../../services/rest.service';
import { ImageLoaderComponent } from '../../../imageLoader/imageLoader.component';

@Component({
  selector: 'app-new-brand',
  templateUrl: './newBrand.component.html',
  styleUrls: [],
})

export class NewBrandComponent {

  brand = {
    name: '',
    description: '',
    logo: ''
  };

  constructor(
    private restService: RESTService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  openUploader(e) {
    const file = e.target.files[0];
    if (/^image\/\w+/.test(file.type)) {
      const modalRef = this.modalService.open(ImageLoaderComponent, {size: 'lg'});
      modalRef.componentInstance.imageURL = URL.createObjectURL(file);
      modalRef.result.then(
        (image) => {
          this.brand.logo = image._id;
          e.target.value = null;
        },
        () => {
          e.target.value = null;
        }
      );
     }
  }

  removeLogo() {
    this.brand.logo = '';
  }

  clickSave() {

    if (this.brand.name === undefined || this.brand.name === '') {
      window.alert('Name is not defined.');
      return;
    }

    this.restService.createBrand(this.brand).subscribe(
      response => {
        this.router.navigate(['/brands']);
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

  clickCancel() {
    this.router.navigate(['/brands']);
  }

}



