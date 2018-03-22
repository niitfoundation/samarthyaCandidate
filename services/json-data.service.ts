import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
// import { LoginComponent } from 'app/components/loginComponent/login/login.component';
import { RequestOptions, Request, RequestMethod } from '@angular/http';

@Injectable()
export class JsonDataService {

  // url to get pincode info
  public mygovKey = '579b464db66ec23bdd000001f3cba562a291414756e233e8e77512de';
  private urlPincode = 'https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?format=json&api-key='
  + this.mygovKey + '&filters[pincode]=';

  // url to retrive data from json file for candidate navLinks
  private urlNavlinks = 'auth/nav-menus';

  // url to get langauges
  private urlLanguages = '/languages';

  // url to get profession
  private urlProfession = '/professions';

  // url to get locations
  private urlLocations = '/locations';

  // url to get placementCenter
  private urlPlacementCenter = '/centres';

  constructor(private http: Http, private snackBar: MdSnackBar, private router: Router) { }

  // Store Registration details in database
  registerUser(formData: any) {
    return this.http.post('/candidates', formData).map(data =>
      data.json()
      , (error: any) => {
        error.json();
      });
  }

  // get json data for candidate navigatin links
  getNavLinks(token: any) {
    return this.http.get(this.urlNavlinks, this.authoriZation(token)).map((response: Response) => response.json());
  };

  // get json data for langauges
  getLanguages() {
    return this.http.get(this.urlLanguages).map((response: Response) => response.json());
  };

  // get json data for candidate register locations
  getLocations() {
    return this.http.get(this.urlLocations).map((response: Response) => response.json());
  };

  // get json data for candidate register profession
  getProfession() {
    return this.http.get(this.urlProfession).map((response: Response) => response.json());
  };

  // get json data for placementCenter
  getPlacementCenter() {
    return this.http.get(this.urlPlacementCenter).map((response: Response) => response.json());
  };

  // get json data for pincode details
  getPincode(pincode: string) {
    return this.http.get(this.urlPincode + pincode)
      .map((response: Response) => response.json());
  };

  verifyToken(token: any) {
    return this.http.post('/auth/verify-email', { token: token }).map((response: Response) => response.json());
  }

  verifyEmail(email: any) {
    return this.http.post('auth/register-email', { username: email }).map((response: Response) => response.json());
  }

  verifyUser(email: any) {
    return this.http.post('auth/verify-user', { username: email }).map((response: Response) => response.json());
  }
  private authoriZation(userToken: any) {
    if (userToken) {
      let headers = new Headers({ 'Authorization': userToken });
      return new RequestOptions({ headers: headers });
    }
  }


}
