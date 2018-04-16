import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  private jwt() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      const headers = new Headers({ 'Authorization': 'Bearer' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }

  getAll() {
    return this.http.get('https://localhost:3000/api/showuser', this.jwt()).map((response: Response) => response.json());
  }
  // create(user:User){
  //   return this.http.post('https://localhost:3005/users/register',user,this.jwt());
  // }
}

