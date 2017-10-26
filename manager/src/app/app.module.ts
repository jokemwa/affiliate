import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RESTService } from './services/rest.service';

import { AppComponent } from './components/_main/app.component';
import { AddProductComponent } from './components/products/childs/addProduct/addProduct.component';
import { BadgesComponent } from './components/badges/badges.component';
import { BrandsComponent } from './components/brands/brands.component';
import { BrokenLinksComponent } from './components/brokenLinks/brokenLinks.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { MainMenuComponent } from './components/mainMenu/mainMenu.component';
import { MainPageComponent } from './components/mainPage/mainPage.component';
import { MarketplacesComponent } from './components/marketplaces/marketplaces.component';
import { ProductsComponent } from './components/products/products.component';
import { ShopsComponent } from './components/shops/shops.component';
import { StatsComponent } from './components/stats/stats.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { TagsComponent } from './components/tags/tags.component';
import { TopNavigationMenusComponent } from './components/topNavigationMenus/topNavigationMenus.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { TranslationComponent } from './components/translation/translation.component';
import { ViewCategoryProductsComponent } from './components/categories/childs/viewCategoryProducts/viewCategoryProducts.component';
import { DeleteCategoryComponent } from './components/categories/childs/deleteCategory/deleteCategory.component';
import { EditCategoryComponent } from './components/categories/childs/editCategory/editCategory.component';
import { NewCategoryComponent } from './components/categories/childs/newCategory/newCategory.component';
import { ProductPreviewComponent } from './components/productPreview/productPreview.component';
import { DeleteProductComponent } from './components/products/childs/deleteProduct/deleteProduct.component';
import { NewBadgeComponent } from './components/badges/childs//newBadge/newBadge.component';
import { EditBadgeComponent } from './components/badges/childs/editBadge/editBadge.component';
import { DeleteBadgeComponent } from './components/badges/childs/deleteBadge/deleteBadge.component';
import { SelectProductComponent } from './components/products/childs/selectProduct/selectProduct.component';
import { ViewBadgeProductsComponent } from './components/badges/childs/viewBadgeProducts/viewBadgeProducts.component';
import { LoginComponent } from './components/user/login/login.component';
import { ChangePasswordComponent } from './components/user/changePassword/changePassword.component';

import { OrderByPipe } from './pipes/orderBy.pipe';

import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'marketplaces',
    component: MarketplacesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'brands',
    component: BrandsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shops',
    component: ShopsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags',
    component: TagsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'suggestions',
    component: SuggestionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'translation',
    component: TranslationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'topnavigationmenus',
    component: TopNavigationMenusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mainpage',
    component: MainPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'badges',
    component: BadgesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stats',
    component: StatsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tracking',
    component: TrackingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'brokenlinks',
    component: BrokenLinksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category/:_id',
    component: ViewCategoryProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'badge/:_id',
    component: ViewBadgeProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'changepassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: MainMenuComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    AddProductComponent,
    BadgesComponent,
    BrandsComponent,
    BrokenLinksComponent,
    CategoriesComponent,
    MainMenuComponent,
    MainPageComponent,
    MarketplacesComponent,
    ProductsComponent,
    ShopsComponent,
    StatsComponent,
    SuggestionsComponent,
    TagsComponent,
    TopNavigationMenusComponent,
    TrackingComponent,
    TranslationComponent,
    ViewCategoryProductsComponent,
    DeleteCategoryComponent,
    NewCategoryComponent,
    EditCategoryComponent,
    ProductPreviewComponent,
    DeleteProductComponent,
    NewBadgeComponent,
    DeleteBadgeComponent,
    EditBadgeComponent,
    SelectProductComponent,
    ViewBadgeProductsComponent,
    LoginComponent,
    ChangePasswordComponent,
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
    AddProductComponent,
    DeleteCategoryComponent,
    NewCategoryComponent,
    EditCategoryComponent,
    ProductPreviewComponent,
    DeleteProductComponent,
    NewBadgeComponent,
    DeleteBadgeComponent,
    EditBadgeComponent,
    SelectProductComponent
  ],
  providers: [
    RESTService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
