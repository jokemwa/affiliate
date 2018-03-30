import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Settings } from '../settings';

import { TrackingService } from './tracking.service';




@Injectable()
export class RESTService {

    private apiUrl = Settings.apiUrl;

    constructor(
        private http: HttpClient,
        private tracking: TrackingService) {
        }

/* Top Navigation */
    public getBrands(): Observable<any> {
        const url = this.apiUrl + '/api/top-navigation-menus/brands-menu';
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

    public getCategories(): Observable<any> {
        const url = this.apiUrl + '/api/categories';
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

    public getShopGroups(): Observable<any> {
        const url = this.apiUrl + '/api/shop-groups';
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

    public search(text: string): Observable<any> {
        const url = this.apiUrl + '/api/search/' + text;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }


/* Main page */
    public getTops(): Observable<any> {
        const url = this.apiUrl + `/api/start-page/tops`;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

    public getTopCategories() {
        const url = this.apiUrl + `/api/start-page/categories-list`;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

    public getMarketingMessage() {
        const url = this.apiUrl + `/api/start-page/marketing-message`;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

/* Products */
    public getProductPreview(id: string): Observable<any> {
        const url = this.apiUrl + `/api/products/preview/` + id;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

    public getProduct(promoLink: string): Observable<any> {
        const url = this.apiUrl + `/api/products/` + promoLink;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

    public getSimilarProducts(id: string): Observable<any> {
        const url = this.apiUrl + `/api/similar/` + id;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

/* Brands */

    public getBrand(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/brands/` + _id;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

/* Categories */

    public getCategory(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/categories/` + _id;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

/* Tags */

    public getTag(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/tags/` + _id;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

/* Shop Groups */

    public getShopGroup(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/shop-groups/` + _id;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

/* Shops */

    public getShop(_id: string): Observable<any> {
        const url = this.apiUrl + `/api/shops/` + _id;
        return this.http
        .get(url,
            {
            headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
            .append('x-session-id', this.tracking.sessionId)
        });
    }

/* Newsletter subscribe */

    public subscribeEmail(email: string): Observable<any> {
        const url = this.apiUrl + `/api/subscribe`;
        const body = {'email': email};
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
                .append('x-device-id', this.tracking.deviceId)
                .append('x-session-id', this.tracking.sessionId)
            });
    }

/* Prices */

public getPrice(_id: string): Observable<any> {
    const url = this.apiUrl + `/api/prices/` + _id;
    return this.http
    .get(url,
        {
        headers: new HttpHeaders().set('x-device-id', this.tracking.deviceId)
        .append('x-session-id', this.tracking.sessionId)
    });
}

}


