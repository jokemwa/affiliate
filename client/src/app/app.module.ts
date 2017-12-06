import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { ProductViewComponent } from './components/products/productView/productView.component';
import { SearchResultsComponent } from './components/searchResults/searchResults.component';
import { ProductPreviewComponent } from './components/products/productPreview/productPreview.component';
import { ProductCarouselComponent } from './components/products/productCarousel/productCarousel.component';
import { SelectCategoryComponent } from './components/topNavigation/childs/selectCategory/selectCategory.component';
import { ProductListComponent } from './components/products/productList/productList.component';


import { OrderByPipe } from './pipes/orderBy.pipe';
import { promise } from 'selenium-webdriver';
import { transition } from '@angular/core/src/animation/dsl';

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
    path: 'shop/:_id',
    component: ShopViewComponent
  },
  {
    path: 'tag/:_id',
    component: TagViewComponent
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
    ProductPreviewComponent,
    ShopViewComponent,
    SearchResultsComponent,
    ProductCarouselComponent,
    SelectCategoryComponent,
    ProductListComponent,
    TagViewComponent,

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
    ProductPreviewComponent,
    SelectCategoryComponent
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
