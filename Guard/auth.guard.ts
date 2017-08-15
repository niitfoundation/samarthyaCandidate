import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Data } from './../services/data.service';
import { AuthenticationService } from './../services/authentication.service' // http request using observable
import 'rxjs/add/operator/toPromise'
// auhentication gaurd if without login user will try to access differnt menu links navigate it to login page

@Injectable()
export class AuthGuard implements CanActivateChild {

    constructor(private router: Router, private data: Data, private http: Http, private AuthenticationService: AuthenticationService) { }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            // logged in user return true
            return this.http.post('/authenticateToken', { token: this.AuthenticationService.getToken() })
                .toPromise()
                .then(response => {
                    if (response.json().success != false) {
                        this.AuthenticationService.setToken(response.json().authToken);
                        return true;
                    }
                }).catch(response => {
                    this.router.navigate(['/login']);
                    localStorage.removeItem('currentUser');
                    this.data.openSnackBar('Please Login!!', 'OK');
                    return false;
                });
        } else {
            this.router.navigate(['/login']);
            localStorage.removeItem('currentUser');
            this.data.openSnackBar('Please Login!!', 'OK');
            return false;
        }
    }
}