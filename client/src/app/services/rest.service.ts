import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable()
export class RESTService {

    private apiUrl = 'http://localhost:4202';

    constructor(
        private http: HttpClient) {
        }


/* Translation */
    public getTranslation() {
        const url = this.apiUrl + '/api/translation';
        return this.http
        .get(url);
    }

/* Top Navigation Menus */
    public getBrandsMenu(): Observable<any> {
        const url = this.apiUrl + '/api/menu/brands';
        return this.http
        .get(url);
    }

    public getCategoriesMenu(): Observable<any> {
        const url = this.apiUrl + '/api/menu/categories';
        return this.http
        .get(url);
    }

    public getMarketplacesMenu(): Observable<any> {
        const url = this.apiUrl + '/api/menu/marketplaces';
        return this.http
        .get(url);
    }

    public getShopsMenu(): Observable<any> {
        const url = this.apiUrl + '/api/menu/shops';
        return this.http
        .get(url);
    }

/* Views */

    public getCategoryView(id: string): Observable<any> {
        const url = this.apiUrl + `/api/category/` + id;
        return this.http
        .get(url);
    }

    public getShopView(id: string): Observable<any> {
        const url = this.apiUrl + `/api/shop/` + id;
        return this.http
        .get(url);
    }

    public getMarketplaceView(id: string): Observable<any> {
        const url = this.apiUrl + `/api/marketplace/` + id;
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

}


