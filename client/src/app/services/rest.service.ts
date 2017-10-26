import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class RESTService {

    /*private deviceToken: String;
    private sessionToken: String;*/


    constructor(
        private http: HttpClient) {
        }

    private headers = new HttpHeaders().set('Content-Type', 'application/json');


    /*connectToServer() {

    }*/

/* Translation */
    public getTranslation() {
        const url = `/api/translation/hebrew`;
        return this.http
        .get(url);
    }



/* Top Navigation Menus */
    public getBrandsMenu(): Observable<any> {
        const url = `/api/menu/brands`;
        return this.http
        .get(url);
    }

    public getCategoriesMenu(): Observable<any> {
        const url = `/api/menu/categories`;
        return this.http
        .get(url);
    }

    public getMarketplacesMenu(): Observable<any> {
        const url = `/api/menu/marketplaces`;
        return this.http
        .get(url);
    }

    public getShopsMenu(): Observable<any> {
        const url = `/api/menu/shops`;
        return this.http
        .get(url);
    }

/* Views */
    public getBrandView(id: String): Observable<any> {
        const url = `/api/brand/` + id;
        return this.http
        .get(url);
    }

    public getCtaegoryView(id: String): Observable<any> {
        const url = `/api/category/` + id;
        return this.http
        .get(url);
    }

    public getShopView(id: String): Observable<any> {
        const url = `/api/shop/` + id;
        return this.http
        .get(url);
    }

    public getMarketplaceView(id: String): Observable<any> {
        const url = `/api/marketplace/` + id;
        return this.http
        .get(url);
    }

    public getProductView(id: String): Observable<any> {
        const url = `/api/product/` + id;
        return this.http
        .get(url);
    }

/* Main page */
    public getTopRated(): Observable<any> {
        const url = `/api/topRated`;
        return this.http
        .get(url);
    }

    public getTopCategories() {

        const topCategories = [{
            name: 'Cat0',
            order: 2,
            products: [
              {_id: 1, order: 0},
              {_id: 2, order: 1},
              {_id: 3, order: 2},
              {_id: 4, order: 3},
              {_id: 5, order: 4},
              {_id: 6, order: 5},
              {_id: 7, order: 6},
              ]
          },
          {
            name: 'Cat1',
            order: 1,
            products: [
                {_id: 1, order: 0},
                {_id: 2, order: 1},
                {_id: 3, order: 2},
                {_id: 4, order: 3},
                {_id: 5, order: 4},
                {_id: 6, order: 5},
                {_id: 7, order: 6},
              ]
          },
          {
            name: 'Cat2',
            order: 0,
            products: [
                {_id: 1, order: 0},
                {_id: 2, order: 1},
                {_id: 3, order: 2},
                {_id: 4, order: 3},
                {_id: 5, order: 4},
                {_id: 6, order: 5},
                {_id: 7, order: 6},
              ]
          }
        ];
        return topCategories;
        /*const url = `/api/topRated`;
        return this.http
        .get(url);*/
    }

    public getProductCard(id: String): Observable<any> {
        const url = `/api/product/card` + id;
        return this.http
        .get(url);
    }

    public getProductPreview(id: String): Observable<any> {
        const url = `/api/product/preview` + id;
        return this.http
        .get(url);
    }

}


