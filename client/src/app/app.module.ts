import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCarouselModule } from 'ngx-carousel';

import { RESTService } from './services/rest.service';
import { TrackingService } from './services/tracking.service';
import { TranslationService } from './services/translation.service';

import { AppComponent } from './components/_main/app.component';

import { TopNavigationComponent } from './components/topNavigation/topNavigation.component';
import { FooterComponent } from './components/footer/footer.component';

import { StartPageComponent } from './components/startPage/startPage.component';
import { BrandViewComponent } from './components/brandView/brandView.component';
import { CategoryViewComponent } from './components/categoryView/categoryView.component';
import { TagViewComponent } from './components/tagView/tagView.component';
import { ShopViewComponent } from './components/shopView/shopView.component';
import { ShopGroupViewComponent } from './components/shopGroupView/shopGroupView.component';
import { ProductViewComponent } from './components/products/productView/productView.component';
import { SearchResultsComponent } from './components/searchResults/searchResults.component';
import { ProductCarouselComponent } from './components/products/productCarousel/productCarousel.component';
import { SelectCategoryComponent } from './components/topNavigation/childs/selectCategory/selectCategory.component';
import { ProductListComponent } from './components/products/productList/productList.component';
import { SelectBrandComponent } from './components/topNavigation/childs/selectBrand/selectBrand.component';
import { SelectShopGroupComponent } from './components/topNavigation/childs/selectShopGroup/selectShopGroup.component';
import { SubscribeResultComponent } from './components/footer/childs/subscribeResult/subscribeResult.component';

import { OrderByPipe } from './pipes/orderBy.pipe';

const appRoutes: Routes = [
  {
    path: 'product/:link',
    component: ProductViewComponent
  },
  {
    path: 'category/:_id',
    component: CategoryViewComponent
  },
  {
    path: 'brand/:_id',
    component: BrandViewComponent
  },
  {
    path: 'shop-group/:_id',
    component: ShopGroupViewComponent
  },
  {
    path: 'shop/:_id',
    component: ShopViewComponent
  },
  {
    path: 'tag/:_id',
    component: TagViewComponent
  },
  {
    path: 'search/:text',
    component: SearchResultsComponent
  },
  {
    path: '**',
    component: StartPageComponent
  }
];

export function initTracking(tracking: TrackingService) {
  return () => tracking.connectToServer();
}

export function initTranslation(translation: TranslationService) {
  return () => translation.loadTranslation();
}

@NgModule({
  declarations: [
    AppComponent,
    TopNavigationComponent,
    FooterComponent,
    StartPageComponent,
    BrandViewComponent,
    CategoryViewComponent,
    ProductViewComponent,
    ShopViewComponent,
    SearchResultsComponent,
    ProductCarouselComponent,
    SelectCategoryComponent,
    ProductListComponent,
    TagViewComponent,
    SelectBrandComponent,
    SelectShopGroupComponent,
    ShopGroupViewComponent,
    SubscribeResultComponent,

    OrderByPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NgxCarouselModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  entryComponents: [
    SelectCategoryComponent,
    SelectBrandComponent,
    SelectShopGroupComponent,
    SubscribeResultComponent
  ],
  providers: [
    {
      'provide': APP_INITIALIZER,
      'useFactory': initTracking,
      'deps': [TrackingService],
      'multi': true
    },
    {
      'provide': APP_INITIALIZER,
      'useFactory': initTranslation,
      'deps': [TranslationService],
      'multi': true
    },
    TrackingService,
    TranslationService,
    RESTService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
