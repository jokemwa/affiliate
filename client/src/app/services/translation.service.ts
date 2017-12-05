import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Settings } from '../settings';

@Injectable()
export class TranslationService {

    private apiUrl = Settings.apiUrl;

    public translation: any;

    constructor(private http: HttpClient) {}

/* Load translation */
    loadTranslation(): Promise<any> {
        return new Promise ((resolve, reject) => {
        this.http.get(this.apiUrl + '/api/translation')
                  .subscribe(
                    response => {
                        this.translation = response;
                        resolve(true);
                    },
                    err => {
                      console.log('Server error: ' + JSON.stringify(err));
                      resolve(false);
                  }
                );
            });
    }

}
