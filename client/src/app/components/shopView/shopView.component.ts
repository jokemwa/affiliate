import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { RESTService } from '../../services/rest.service';



@Component({
  selector: 'app-shop-view',
  templateUrl: './shopView.component.html',
  styleUrls: [],
})

export class ShopViewComponent implements OnInit {

  product: any;

  constructor(
    private restService: RESTService,
    private route: ActivatedRoute,
    private location: Location) {}

  ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.restService.getProduct(params.get('link')))
        .subscribe(response => {
          this.product = response;
        },
        err => {
          window.alert('Server error: ' + err);
          console.log(err);
      });
  }

}
