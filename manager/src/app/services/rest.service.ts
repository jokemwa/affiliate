import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RESTService {
    public token: string;

    constructor(
        private http: HttpClient) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.token = currentUser && currentUser.token;
        }

    private headers = new HttpHeaders().set('x-access-token', this.token);
    private json = new HttpHeaders().set('Content-Type', 'application/json');
    private jsonHeaders = new HttpHeaders().set('x-access-token', this.token)
    .append('Content-Type', 'application/json');

/* Auth */

    public login(username: String, password: String): Promise<boolean> {
        return new Promise ((resolve, reject) => {
            this.http.post('/api/user/login', JSON.stringify({ username: username, password: password }), {headers: this.json}).subscribe(
                response => {
                    const resp = JSON.parse(JSON.stringify(response));
                    this.token = resp.token;
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: this.token }));
                    resolve(true);
                },
                err => {
                  window.alert('Server error: ' + JSON.stringify(err));
                  console.log(err);
                  resolve(false);
              }
            );
        });
    }

    public changePassowrd(oldPw: String, newPw: String): Observable<any> {
        return this.http.post('/api/user/changepassword',
         JSON.stringify({ old: oldPw, new: newPw }), {headers: this.json});
    }

    public logout(): void {
        this.token = null;
        localStorage.removeItem('currentUser');
    }


/* Products */
    public getProduct(id: String): Observable<any> {
        const url = `/api/products/` + id;
        return this.http
        .get(url, {headers: this.headers});
    }

    public createProduct(link: String): Observable<any> {
        const url = `/api/products`;
        const body = {link: link};
        return this.http
        .post(url, body, {headers: this.jsonHeaders});
    }

    public updateProduct(product: any): Observable<any> {
        const url = `/api/products/${product._id}`;
        return this.http
        .put(url, product, {headers: this.jsonHeaders});
    }

    public deleteProduct(id: String): Observable<any> {
        const url = `/api/products/` + id;
        return this.http
        .delete(url, {headers: this.headers});
    }

    public addBadgeToProduct(product_id: String, badge_id: String): Observable<any> {
        const url = `/api/products/` + product_id + '/badges/' + badge_id;
        return this.http
        .post(url, {}, {headers: this.jsonHeaders});
    }

    public removeBadgeFromProduct(product_id: String, badge_id: String): Observable<any> {
        const url = `/api/products/` + product_id + '/badges/' + badge_id;
        return this.http
        .delete(url, {headers: this.headers});
    }

    public getProducts(): Observable<any> {
        const url = `/api/products/`;
        return this.http
        .get(url, {headers: this.headers});
    }

/* Marketplaces */
    public getMarketplaces(): Observable<any> {
        const url = `/api/marketplaces`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public getMarketplace(marketplaceId: String): Observable<any> {
        const url = `/api/marketplaces/${marketplaceId}`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public getMarketplaceShops(marketplaceId: String): Observable<any> {
        const url = `/api/marketplaces/${marketplaceId}/shops`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public addMarketplaceShop(marketplaceId: String, shop: any): Observable<any> {
        const url = `/api/marketplaces/${marketplaceId}/shops`;
        return this.http
        .post(url, shop, {headers: this.jsonHeaders});
    }

/* Shops */
    public addProductToShop(shop_id: String, product_id: String): Observable<any> {
        const url = `/api/shops/` + shop_id;
        const body = {
            product_id: product_id
        };
        return this.http
        .post(url, body, {headers: this.jsonHeaders});
    }

/* Categories */
    public getCategories(): Observable<any> {
        const url = `/api/categories`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public createCategory(category: any): Observable<any> {
        const url = `/api/categories`;
        return this.http
        .post(url, category, {headers: this.jsonHeaders});
    }

    public getCategory(_id: String): Observable<any> {
        const url = `/api/categories/` + _id;
        return this.http
        .get(url, {headers: this.headers});
    }

    public updateCategory(category: any): Observable<any> {
        const url = `/api/categories/` + category._id;
        return this.http
        .put(url, category, {headers: this.jsonHeaders});
    }

    public deleteCategory(_id: String): Observable<any> {
        const url = `/api/categories/` + _id;
        return this.http
        .delete(url, {headers: this.headers});
    }

    public changeProductCategory(prev_id: String, new_id: String, product_id: String): Observable<any> {
        const url = `/api/categories/change`;
        const body = {
            prevCategory: prev_id,
            newCategory: new_id,
            product: product_id
        };
        return this.http
        .put(url, body, {headers: this.jsonHeaders});
    }

    public addProductToCategory(category_id: String, product_id: String): Observable<any> {
        const url = `/api/categories/` + category_id;
        const body = {
            product_id: product_id
        };
        return this.http
        .post(url, body, {headers: this.jsonHeaders});
    }

    public removeProductFromCategory(category_id: String, product_id: String): Observable<any> {
        const url = `/api/categories/` + category_id + '/' + product_id;
        return this.http
        .delete(url, {headers: this.headers});
    }

/* Brands */
    public getBrands(): Observable<any> {
        const url = `/api/brands`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public createBrand(brand: any): Observable<any> {
        const url = `/api/brands`;
        return this.http
        .post(url, brand, {headers: this.jsonHeaders});
    }

    public addProductToBrand(brand_id: String, product_id: String): Observable<any> {
        const url = `/api/brands/` + brand_id;
        const body = {
            product_id: product_id
        };
        return this.http
        .post(url, body, {headers: this.jsonHeaders});
    }

/* Tags */
    public getTags(): Observable<any> {
        const url = `/api/tags`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public getTag(tagId: String): Observable<any> {
        const url = `/api/tags/${tagId}`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public createTag(tag: any): Observable<any> {
        const url = `/api/tags`;
        return this.http
        .post(url, tag, {headers: this.jsonHeaders});
    }

    public addProductToTag(tag_id: String, product_id: String): Observable<any> {
        const url = `/api/tags/` + tag_id;
        const body = {
            product_id: product_id
        };
        return this.http
        .post(url, body, {headers: this.jsonHeaders});
    }

/* Badges */
    public getBadges(): Observable<any> {
        const url = `/api/badges`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public getBadgesWithProducts(): Observable<any> {
        const url = `/api/badges/products`;
        return this.http
        .get(url, {headers: this.headers});
    }

    public getBadge(badge_id: String): Observable<any> {
        const url = `/api/badges/` + badge_id;
        return this.http
        .get(url, {headers: this.headers});
    }

    public deleteBadge(badge_id: String): Observable<any> {
        const url = `/api/badges/` + badge_id;
        return this.http
        .delete(url, {headers: this.headers});
    }

    public updateBadge(badge: any): Observable<any> {
        const url = `/api/badges/` + badge._id;
        return this.http
        .put(url, badge, {headers: this.jsonHeaders});
    }

    public createBadge(badge: any): Observable<any> {
        const url = `/api/badges`;
        return this.http
        .post(url, badge, {headers: this.jsonHeaders});
    }


/* Translation */

public loadTranslation(): Observable<any> {
    const url = `/api/translation/hebrew`;
    return this.http
    .get(url, {headers: this.headers});
}

public saveTranslation(translation): Observable<any> {
    const url = `/api/translation/hebrew`;
    const body = translation;
    return this.http
    .post(url, body, {headers: this.jsonHeaders});
}

}
