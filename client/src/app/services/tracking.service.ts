import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Settings } from '../settings';

@Injectable()
export class TrackingService {

    private apiUrl = Settings.apiUrl;

    public deviceId = '';
    public sessionId = '';

    constructor(private http: HttpClient) {
    }

/* Activity tracking */

    connectToServer(): Promise<any> {
        return new Promise ((resolve, reject) => {
        const currentDevice = JSON.parse(localStorage.getItem('currentDevice'));
        if (currentDevice !== null) {
            this.deviceId = currentDevice._id;
        }
        const body = {deviceId: this.deviceId};
        this.http.post(this.apiUrl + '/api/client',
                body,
                {
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                })
                  .subscribe(
                    response => {
                        const resp = JSON.parse(JSON.stringify(response));
                        if (this.deviceId !== resp.deviceId) {
                            this.deviceId = resp.deviceId;
                            localStorage.setItem('currentDevice', JSON.stringify({ _id: this.deviceId }));
                        }
                        this.sessionId = resp.sessionId;
                        resolve(true);
                    },
                    err => {
                      console.log('Server error: ' + JSON.stringify(err));
                      resolve(false);
                  }
                );
            });
    }

    trackAction(location, actionType, target) {
        const body = {
            location: location,
            actionType: actionType,
            target: target
        };
        this.http.post(this.apiUrl + '/api/client/action',
                body,
                {
                    headers: new HttpHeaders().set('Content-Type', 'application/json')
                    .append('x-device-id', this.deviceId)
                    .append('x-session-id', this.sessionId)
                })
                  .subscribe();
    }

}
