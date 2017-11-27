import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RESTService } from '../../services/rest.service';


@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: [],
})

export class TranslationComponent implements OnInit {

  isDataReady = false;
  translation: any;

  constructor(
    private restService: RESTService,
    private router: Router,
    private location: Location) {}

  ngOnInit(): void {
      this.loadTranslation();
  }

  loadTranslation() {
    this.restService.loadTranslation().subscribe(
      response => {
          this.translation = response;
          this.isDataReady = true;
      },
      err => {
        if (err.status === 401 || err.status === 403) {
          this.restService.logout();
          this.router.navigate(['/login']);
        } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
        }
      }
    );
  }

  saveTranslation(logoTitle,
    facebookLink,
    youtubeLink,
    searchGoButtion,
    searchboxPlaceholder,
    couponsLink,
    marketplacesLink,
    shopsLink,
    brandsLink,
    suggestionsLink,
    categoriesLink,
    homeLink,
    header,
    topRated,
    whatsNew,
    browseAll,
    viewMore) {


    if (logoTitle !== undefined && logoTitle !== '') {
        this.translation.topNavigation.logoTitle = logoTitle;
    } else {
      window.alert('Logo Title is empty!');
      return;
    }

    if (facebookLink !== undefined && facebookLink !== '') {
      this.translation.topNavigation.facebookLink = facebookLink;
    } else {
      window.alert('Facebook Link is empty!');
      return;
    }

    if (youtubeLink !== undefined && youtubeLink !== '') {
      this.translation.topNavigation.youtubeLink = youtubeLink;
    } else {
      window.alert('Youtube Link is empty!');
      return;
    }

    if (searchGoButtion !== undefined && searchGoButtion !== '') {
      this.translation.topNavigation.searchGoButtion = searchGoButtion;
    } else {
      window.alert('Search Go Button is empty!');
      return;
    }

    if (searchboxPlaceholder !== undefined && searchboxPlaceholder !== '') {
      this.translation.topNavigation.searchboxPlaceholder = searchboxPlaceholder;
    } else {
      window.alert('Searchbox Placeholder is empty!');
      return;
    }

    if (shopsLink !== undefined && shopsLink !== '') {
      this.translation.topNavigation.shopsLink = shopsLink;
    } else {
      window.alert('Shops Nav Link is empty!');
      return;
    }

    if (brandsLink !== undefined && brandsLink !== '') {
      this.translation.topNavigation.brandsLink = brandsLink;
    } else {
      window.alert('Brands Nav Link is empty!');
      return;
    }

    if (categoriesLink !== undefined && categoriesLink !== '') {
      this.translation.topNavigation.categoriesLink = categoriesLink;
    } else {
      window.alert('Categories Nav Link is empty!');
      return;
    }

    if (homeLink !== undefined && homeLink !== '') {
      this.translation.topNavigation.homeLink = homeLink;
    } else {
      window.alert('Home Nav Link is empty!');
      return;
    }

    if (topRated !== undefined && topRated !== '') {
      this.translation.startPage.topRated = topRated;
    } else {
      window.alert('Top Rated Label is empty!');
      return;
    }

    if (whatsNew !== undefined && whatsNew !== '') {
      this.translation.startPage.whatsNew = whatsNew;
    } else {
      window.alert('What\'s New Label is empty!');
      return;
    }

    if (browseAll !== undefined && browseAll !== '') {
      this.translation.startPage.browseAll = browseAll;
    } else {
      window.alert('Browse All Label is empty!');
      return;
    }

    if (viewMore !== undefined && viewMore !== '') {
      this.translation.productPreview.viewMore = viewMore;
    } else {
      window.alert('View More Button is empty!');
      return;
    }

    this.restService.saveTranslation(this.translation).subscribe(
      response => {
          window.alert('Translation saved.');
      },
      err => {
        if (err.status === 401 || err.status === 403) {
          this.restService.logout();
          this.router.navigate(['/login']);
        } else {
        window.alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
        }
      }
    );
  }

  clickCancel() {
    this.location.back();
  }

}
