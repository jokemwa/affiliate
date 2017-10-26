import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from './services/rest.service';

import { AppComponent } from './components/_main/app.component';

import { TopNavigationComponent } from './components/topNavigation/topNavigation.component';
import { FooterComponent } from './components/footer/footer.component';

import { StartPageComponent } from './components/startPage/startPage.component';
import { BrandViewComponent } from './components/brandView/brandView.component';
import { CategoryViewComponent } from './components/categoryView/categoryView.component';
import { MarketplaceViewComponent } from './components/marketplaceView/marketplaceView.component';
import { ShopViewComponent } from './components/shopView/shopView.component';
import { ProductViewComponent } from './components/productView/productView.component';
import { SearchResultsComponent } from './components/searchResults/searchResults.component';

import { BrandSelectComponent } from './components/brandSelect/brandSelect.component';
import { CategorySelectComponent } from './components/categorySelect/categorySelect.component';
import { MarketplaceSelectComponent } from './components/marketplaceSelect/marketplaceSelect.component';
import { ShopSelectComponent } from './components/shopSelect/shopSelect.component';
import { ProductPreviewComponent } from './components/productPreview/productPreview.component';

import { OrderByPipe } from './pipes/orderBy.pipe';

const appRoutes: Routes = [
  {
    path: 'product/:link',
    component: ProductViewComponent
  },
  {
    path: 'category/:name',
    component: CategoryViewComponent
  },
  {
    path: 'brand/:name',
    component: BrandViewComponent
  },
  {
    path: 'shop/:name',
    component: ShopViewComponent
  },
  {
    path: 'marketplace/:name',
    component: MarketplaceViewComponent
  },
  {
    path: '**',
    component: StartPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TopNavigationComponent,
    FooterComponent,
    StartPageComponent,
    BrandViewComponent,
    CategoryViewComponent,
    MarketplaceViewComponent,
    ProductViewComponent,
    BrandSelectComponent,
    CategorySelectComponent,
    MarketplaceSelectComponent,
    ShopSelectComponent,
    ProductPreviewComponent,
    ShopViewComponent,
    SearchResultsComponent,

    OrderByPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
    )
  ],
  entryComponents: [
    BrandSelectComponent,
    CategorySelectComponent,
    MarketplaceSelectComponent,
    ShopSelectComponent,
    ProductPreviewComponent
  ],
  providers: [
    RESTService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
