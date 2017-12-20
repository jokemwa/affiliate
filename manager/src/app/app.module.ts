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
import { StartPageComponent } from './components/startPage/startPage.component';
import { MarketplacesComponent } from './components/marketplaces/marketplaces.component';
import { ProductsComponent } from './components/products/products.component';
import { ShopsComponent } from './components/shops/shops.component';
import { StatsComponent } from './components/stats/stats.component';
import { HintsComponent } from './components/hints/hints.component';
import { TagsComponent } from './components/tags/tags.component';
import { TopNavigationMenusComponent } from './components/topNavigationMenus/topNavigationMenus.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { TranslationComponent } from './components/translation/translation.component';
import { ViewCategoryProductsComponent } from './components/categories/childs/viewCategoryProducts/viewCategoryProducts.component';
import { DeleteCategoryComponent } from './components/categories/childs/deleteCategory/deleteCategory.component';
import { EditCategoryComponent } from './components/categories/childs/editCategory/editCategory.component';
import { NewCategoryComponent } from './components/categories/childs/newCategory/newCategory.component';
import { ProductPreviewComponent } from './components/products/childs/productPreview/productPreview.component';
import { DeleteProductComponent } from './components/products/childs/deleteProduct/deleteProduct.component';
import { NewBadgeComponent } from './components/badges/childs//newBadge/newBadge.component';
import { EditBadgeComponent } from './components/badges/childs/editBadge/editBadge.component';
import { DeleteBadgeComponent } from './components/badges/childs/deleteBadge/deleteBadge.component';
import { SelectProductComponent } from './components/products/childs/selectProduct/selectProduct.component';
import { ViewBadgeProductsComponent } from './components/badges/childs/viewBadgeProducts/viewBadgeProducts.component';
import { LoginComponent } from './components/user/login/login.component';
import { ChangePasswordComponent } from './components/user/changePassword/changePassword.component';
import { AddMarketplaceComponent } from './components/marketplaces/childs/addMarketplace/addMarketplace.component';
import { DeleteMarketplaceComponent } from './components/marketplaces/childs/deleteMarketplace/deleteMarketplace.component';
import { EditMarketplaceComponent } from './components/marketplaces/childs/editMarketplace/editMarketplace.component';
import { ImageLoaderComponent } from './components/imageLoader/imageLoader.component';
import { VievMarketplaceProductsComponent } from './components/marketplaces/childs/viewMarketplaceProducts/viewMarketplaceProducts.component';
import { DeleteShopComponent } from './components/shops/childs/deleteShop/deleteShop.component';
import { VievMarketplaceShopsComponent } from './components/marketplaces/childs/viewMarketplaceShops/viewMarketplaceShops.component';
import { AddShopToMarketplaceComponent } from './components/marketplaces/childs/viewMarketplaceShops/childs/addShopToMarketplace/addShopToMarketplace.component';
import { DeleteBrandComponent } from './components/brands/childs/deleteBrand/deleteBrand.component';
import { EditBrandComponent } from './components/brands/childs/editBrand/editBrand.component';
import { NewBrandComponent } from './components/brands/childs/newBrand/newBrand.component';
import { ViewBrandProductsComponent } from './components/brands/childs/viewBrandProducts/viewBrandProducts.component';
import { EditProductComponent } from './components/products/childs/editProduct/editProduct.component';
import { EditTagComponent } from './components/tags/childs/editTag/editTag.component';
import { NewTagComponent } from './components/tags/childs/newTag/newTag.component';
import { DeleteTagComponent } from './components/tags/childs/deleteTag/deleteTag.component';
import { ViewTagProductsComponent } from './components/tags/childs/viewTagProducts/viewTagProducts.component';
import { EditShopComponent } from './components/shops/childs/editShop/editShop.component';
import { AddShopComponent } from './components/shops/childs/addShop/addShop.component';
import { ViewShopProductsComponent } from './components/shops/childs/viewShopProducts/viewShopProducts.component';
import { EditShopGroupComponent } from './components/shopGroups/childs/editShopGroup/editShopGroup.component';
import { NewShopGroupComponent } from './components/shopGroups/childs/newShopGroup/newShopGroup.component';
import { DeleteShopGroupComponent } from './components/shopGroups/childs/deleteShopGroup/deleteShopGroup.component';
import { ViewShopGroupShopsComponent } from './components/shopGroups/childs/viewShopGroupShops/viewShopGroupShops.component';
import { SelectShopComponent } from './components/shops/childs/selectShop/selectShop.component';
import { ShopGroupsComponent } from './components/shopGroups/shopGroups.component';
import { ListProductsComponent } from './components/startPage/childs/listProducts/listProducts.component';
import { SelectCategoryComponent } from './components/categories/childs/selectCategory/selectCategory.component';
import { SelectBrandComponent } from './components/brands/childs/selectBrand/selectBrand.component';
import { SubscribeListComponent } from './components/subscribeList/subscribeList.component';



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
    path: 'hints',
    component: HintsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'translation',
    component: TranslationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'top-navigation-menus',
    component: TopNavigationMenusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'start-page',
    component: StartPageComponent,
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
    path: 'marketplaces/add',
    component: AddMarketplaceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'marketplaces/:_id/edit',
    component: EditMarketplaceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'marketplaces/:_id/products',
    component: VievMarketplaceProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'marketplaces/:_id/shops',
    component: VievMarketplaceShopsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'marketplaces/:_id/shops/add',
    component: AddShopToMarketplaceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'brands/add',
    component: NewBrandComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'brands/:_id/edit',
    component: EditBrandComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'brands/:_id/products',
    component: ViewBrandProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags/:_id/products',
    component: ViewTagProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shops/:_id/products',
    component: ViewShopProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shops/add',
    component: AddShopComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shops/:_id/edit',
    component: EditShopComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shopgroups',
    component: ShopGroupsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shopgroups/:_id/shops',
    component: ViewShopGroupShopsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'subscribe-list',
    component: SubscribeListComponent,
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
    StartPageComponent,
    MarketplacesComponent,
    ProductsComponent,
    ShopsComponent,
    StatsComponent,
    HintsComponent,
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
    AddMarketplaceComponent,
    ImageLoaderComponent,
    DeleteMarketplaceComponent,
    EditMarketplaceComponent,
    VievMarketplaceProductsComponent,
    DeleteShopComponent,
    VievMarketplaceShopsComponent,
    AddShopToMarketplaceComponent,
    NewBrandComponent,
    EditBrandComponent,
    DeleteBrandComponent,
    ViewBrandProductsComponent,
    EditProductComponent,
    NewTagComponent,
    EditTagComponent,
    DeleteTagComponent,
    ViewTagProductsComponent,
    EditShopComponent,
    AddShopComponent,
    ViewShopProductsComponent,
    ShopGroupsComponent,
    DeleteShopGroupComponent,
    NewShopGroupComponent,
    EditShopGroupComponent,
    ViewShopGroupShopsComponent,
    SelectShopComponent,
    ListProductsComponent,
    SelectCategoryComponent,
    SelectBrandComponent,
    SubscribeListComponent,

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
    SelectProductComponent,
    ImageLoaderComponent,
    DeleteMarketplaceComponent,
    DeleteShopComponent,
    DeleteBrandComponent,
    EditProductComponent,
    NewTagComponent,
    EditTagComponent,
    DeleteTagComponent,
    DeleteShopGroupComponent,
    NewShopGroupComponent,
    EditShopGroupComponent,
    SelectShopComponent,
    SelectCategoryComponent,
    SelectBrandComponent
  ],
  providers: [
    RESTService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
