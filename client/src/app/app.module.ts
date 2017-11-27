import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from './services/rest.service';
import { TrackingService } from './services/tracking.service';

import { AppComponent } from './components/_main/app.component';

import { TopNavigationComponent } from './components/topNavigation/topNavigation.component';
import { FooterComponent } from './components/footer/footer.component';

import { StartPageComponent } from './components/startPage/startPage.component';
import { BrandViewComponent } from './components/brandView/brandView.component';
import { CategoryViewComponent } from './components/categoryView/categoryView.component';
import { ShopViewComponent } from './components/shopView/shopView.component';
import { ProductViewComponent } from './components/products/productView/productView.component';
import { SearchResultsComponent } from './components/searchResults/searchResults.component';
import { ProductPreviewComponent } from './components/products/productPreview/productPreview.component';
import { ProductCarouselComponent } from './components/startPage/childs/productCarousel/productCarousel.component';

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
    path: 'shop/:_id',
    component: ShopViewComponent
  },
  {
    path: '**',
    component: StartPageComponent
  }
];

export function init(trackConfig: TrackingService) {
  return () => trackConfig.connectToServer();
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
    ProductPreviewComponent
  ],
  providers: [
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [TrackingService],
      'multi': true
    },
    TrackingService,
    RESTService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
