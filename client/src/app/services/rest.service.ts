import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Settings } from '../settings';



@Injectable()
export class RESTService {

    private apiUrl = Settings.apiUrl;

    constructor(
        private http: HttpClient) {
        }

/* Top Navigation */
    public getBrands(): Observable<any> {
        const url = this.apiUrl + '/api/top-navigation-menus/brands-menu';
        return this.http
        .get(url);
    }

    public getCategories(): Observable<any> {
        const url = this.apiUrl + '/api/categories';
        return this.http
        .get(url);
    }

    public getShopGroups(): Observable<any> {
        const url = this.apiUrl + '/api/shop-groups';
        return this.http
        .get(url);
    }

    public search(text: string): Observable<any> {
        const url = this.apiUrl + '/api/search/' + text;
        return this.http
        .get(url);
    }


/* Main page */
    public getTops(): Observable<any> {
        const url = this.apiUrl + `/api/start-page/tops`;
        return this.http
        .get(url);
    }

    public getTopCategories() {
        const url = this.apiUrl + `/api/start-page/categories-list`;
        return this.http
        .get(url);
    }

    public getMarketingMessage() {
        const url = this.apiUrl + `/api/start-page/marketing-message`;
        return this.http
        .get(url);
    }

/* Products */
    public getProductPreview(id: string): Observable<any> {
        const url = this.apiUrl + `/api/products/preview/` + id;
        return this.http
        .get(url);
    }

    public getProduct(promoLink: string): Observable<any> {
        const url = this.apiUrl + `/api/products/` + promoLink;
        return this.http
        .get(url);
    }

/* Brands */

    public getBrand(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/brands/` + _id;
        return this.http
        .get(url);
    }

/* Categories */

    public getCategory(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/categories/` + _id;
        return this.http
        .get(url);
    }

/* Tags */

    public getTag(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/tags/` + _id;
        return this.http
        .get(url);
    }

/* Shop Groups */

    public getShopGroup(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/shop-groups/` + _id;
        return this.http
        .get(url);
    }

/* Shops */

    public getShop(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/shops/` + _id;
        return this.http
        .get(url);
    }

/* Newsletter subscribe */

    public subscribeEmail(email: string): Observable<any> {
        const url = this.apiUrl + `/api/subscribe`;
        const body = {'email': email};
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
            });
    }

}


