import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RESTService {
    public token: string;

    constructor(
        private http: HttpClient) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser !== null) {
                this.token = currentUser.token;
            }
        }

/* Auth */

    public login(username: String, password: String): Promise<boolean> {
        return new Promise ((resolve, reject) => {
            this.http.post('/api/user/login',
            JSON.stringify({ username: username, password: password }),
            {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
            })
              .subscribe(
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
         JSON.stringify({ old: oldPw, new: newPw }),
          {
              headers: new HttpHeaders().set('Content-Type', 'application/json')
            });
    }

    public logout(): void {
        this.token = null;
        localStorage.removeItem('currentUser');
    }


/* Products */
    public getProduct(id: String): Observable<any> {
        const url = `/api/products/` + id;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public createProduct(link: String): Observable<any> {
        const url = `/api/products`;
        const body = {link: link};
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public updateProduct(product: any): Observable<any> {
        const url = `/api/products/${product._id}`;
        return this.http
        .put(url, product,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public deleteProduct(id: String): Observable<any> {
        const url = `/api/products/` + id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public addBadgeToProduct(product_id: String, badge_id: String): Observable<any> {
        const url = `/api/products/` + product_id + '/badges/' + badge_id;
        return this.http
        .post(url, {},
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public removeBadgeFromProduct(product_id: String, badge_id: String): Observable<any> {
        const url = `/api/products/` + product_id + '/badges/' + badge_id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getProducts(): Observable<any> {
        const url = `/api/products/`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

/* Marketplaces */
    public getMarketplaces(): Observable<any> {
        const url = `/api/marketplaces`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getMarketplacesWithProducts(): Observable<any> {
        const url = `/api/marketplaces/products`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getMarketplace(marketplaceId: String): Observable<any> {
        const url = `/api/marketplaces/${marketplaceId}`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public deleteMarketplace(marketplaceId: String): Observable<any> {
        const url = `/api/marketplaces/${marketplaceId}`;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public createMarketplace(marketplace: any): Observable<any> {
        const url = `/api/marketplaces/`;
        return this.http
        .post(url, marketplace,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public updateMarketplace(marketplace: any): Observable<any> {
        const url = `/api/marketplaces/` + marketplace._id;
        return this.http
        .put(url, marketplace,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public getMarketplaceShops(marketplaceId: String): Observable<any> {
        const url = `/api/marketplaces/${marketplaceId}/shops`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public addShopToMarketplace(marketplace_id: string, shop_id: string): Observable<any> {
        const url = `/api/marketplaces/${marketplace_id}/shops`;
        const body = {
            shop_id: shop_id
        };
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public getMarketplaceProducts(marketplaceId: String): Observable<any> {
        const url = `/api/marketplaces/${marketplaceId}/products`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

/* Shops */
    public getShops(): Observable<any> {
        const url = `/api/shops/`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public createShop(shop: any): Observable<any> {
        const url = `/api/shops/`;
        return this.http
        .post(url, shop,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public getShop(shop_Id: string): Observable<any> {
        const url = `/api/shops/${shop_Id}`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getShopMarketplace(shop_Id: string): Observable<any> {
        const url = `/api/shops/${shop_Id}/marketplace`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public deleteShop(shop_Id: string): Observable<any> {
        const url = `/api/shops/${shop_Id}`;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public updateShop(shop: any): Observable<any> {
        const url = `/api/shops/` + shop._id;
        return this.http
        .put(url, shop,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public addProductToShop(shop_id: string, product_id: string): Observable<any> {
        const url = `/api/shops/` + shop_id;
        const body = {
            product_id: product_id
        };
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public removeProductFromShop(shop_id: string, product_id: string): Observable<any> {
        const url = `/api/shops/` + shop_id + '/' + product_id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

/* Shop Groups */
    public getShopGroups(): Observable<any> {
        const url = `/api/shopgroups/`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getShopGroup(shopGroup_Id: string): Observable<any> {
        const url = `/api/shopgroups/${shopGroup_Id}`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public createShopGroup(shopGroup: any): Observable<any> {
        const url = `/api/shopgroups/`;
        return this.http
        .post(url, shopGroup,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public deleteShopGroup(shopGroup_Id: string): Observable<any> {
        const url = `/api/shopgroups/${shopGroup_Id}`;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public updateShopGroup(shopGroup: any): Observable<any> {
        const url = `/api/shopgroups/` + shopGroup._id;
        return this.http
        .put(url, shopGroup,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public getShopShopGroups(shop_id: string): Observable<any> {
        const url = `/api/shopgroups/shop/` + shop_id;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }


    public updateShopShopGroups(shopGroups: any, shop_id: string): Observable<any> {
        const url = `/api/shopgroups/shop`;
        const body = {
            shop_id: shop_id,
            shopGroups: shopGroups
        };
        return this.http
        .put(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public addShopToShopGroup(shopGroup_id: string, shop_id: string): Observable<any> {
        const url = `/api/shopgroups/` + shopGroup_id;
        const body = {
            shop_id: shop_id
        };
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public removeShopFromShopGroup(shopGroup_id: string, shop_id: string): Observable<any> {
        const url = `/api/shopgroups/` + shopGroup_id + '/' + shop_id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

/* Categories */
    public getCategories(): Observable<any> {
        const url = `/api/categories`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public createCategory(category: any): Observable<any> {
        const url = `/api/categories`;
        return this.http
        .post(url, category,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public getCategory(_id: String): Observable<any> {
        const url = `/api/categories/` + _id;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public updateCategory(category: any): Observable<any> {
        const url = `/api/categories/` + category._id;
        return this.http
        .put(url, category,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public deleteCategory(_id: String): Observable<any> {
        const url = `/api/categories/` + _id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public changeProductCategory(prev_id: String, new_id: String, product_id: String): Observable<any> {
        const url = `/api/categories/change`;
        const body = {
            prevCategory: prev_id,
            newCategory: new_id,
            product: product_id
        };
        return this.http
        .put(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public addProductToCategory(category_id: string, product_id: string): Observable<any> {
        const url = `/api/categories/` + category_id;
        const body = {
            product_id: product_id
        };
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public removeProductFromCategory(category_id: String, product_id: String): Observable<any> {
        const url = `/api/categories/` + category_id + '/' + product_id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

/* Brands */
    public getBrands(): Observable<any> {
        const url = `/api/brands`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getBrand(_id: String): Observable<any> {
        const url = `/api/brands/` + _id;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public updateBrand(brand: any): Observable<any> {
        const url = `/api/brands/` + brand._id;
        return this.http
        .put(url, brand,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public deleteBrand(_id: String): Observable<any> {
        const url = `/api/brands/` + _id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public createBrand(brand: any): Observable<any> {
        const url = `/api/brands`;
        return this.http
        .post(url, brand,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public addProductToBrand(brand_id: string, product_id: string): Observable<any> {
        const url = `/api/brands/` + brand_id;
        const body = {
            product_id: product_id
        };
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public removeProductFromBrand(brand_id: string, product_id: string): Observable<any> {
        const url = `/api/brands/` + brand_id + '/' + product_id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

/* Tags */
    public getTags(): Observable<any> {
        const url = `/api/tags`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getTag(tagId: String): Observable<any> {
        const url = `/api/tags/${tagId}`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public createTag(tag: any): Observable<any> {
        const url = `/api/tags`;
        return this.http
        .post(url, tag,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public updateTag(tag: any): Observable<any> {
        const url = `/api/tags/` + tag._id;
        return this.http
        .put(url, tag,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public deleteTag(_id: String): Observable<any> {
        const url = `/api/tags/` + _id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public addProductToTag(tag_id: string, product_id: string): Observable<any> {
        const url = `/api/tags/` + tag_id;
        const body = {
            product_id: product_id
        };
        return this.http
        .post(url, body,
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .append('x-access-token', this.token)
            });
    }

    public removeProductFromTag(tag_id: string, product_id: string): Observable<any> {
        const url = `/api/tags/` + tag_id + '/' + product_id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public removeProductFromTags(product_id: string): Observable<any> {
        const url = `/api/tags/products/` + product_id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

/* Badges */
    public getBadges(): Observable<any> {
        const url = `/api/badges`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getBadgesWithProducts(): Observable<any> {
        const url = `/api/badges/products`;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public getBadge(badge_id: String): Observable<any> {
        const url = `/api/badges/` + badge_id;
        return this.http
        .get(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public deleteBadge(badge_id: String): Observable<any> {
        const url = `/api/badges/` + badge_id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public updateBadge(badge: any): Observable<any> {
        const url = `/api/badges/` + badge._id;
        return this.http
        .put(url, badge,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

    public createBadge(badge: any): Observable<any> {
        const url = `/api/badges`;
        return this.http
        .post(url, badge,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }


/* Translation */

public loadTranslation(): Observable<any> {
    const url = `/api/translation/hebrew`;
    return this.http
    .get(url,
        {
            headers: new HttpHeaders()
            .set('x-access-token', this.token)
        });
}

public saveTranslation(translation): Observable<any> {
    const url = `/api/translation/hebrew`;
    const body = translation;
    return this.http
    .post(url, body,
        {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .append('x-access-token', this.token)
        });
}

public sendFile(formData): Observable<any> {
    const url = `/api/file`;
    return this.http
    .post(url, formData,
        {
            headers: new HttpHeaders()
            .set('x-access-token', this.token)
        });
}

/* Images */

    public deleteImage(_id: string): Observable<any> {
        const url = `/api/images/` + _id;
        return this.http
        .delete(url,
            {
                headers: new HttpHeaders()
                .set('x-access-token', this.token)
            });
    }

}
