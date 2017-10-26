import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../services/rest.service';



@Component({
  selector: 'app-product-view',
  templateUrl: './productView.component.html',
  styleUrls: [],
})

export class ProductViewComponent implements OnInit {

  product: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location) {}

  ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.restService.getProductView(params.get('link')))
        .subscribe(response => {
          this.product = response;
        },
        err => {
          window.alert('Server error: ' + err);
          console.log(err);
      });
  }

}
