import { JsonDataService } from './../../services/json-data.service';
import { UserService } from './../../services/user.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Router } from '@angular/router'
import { Component, OnInit } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Data } from './../../services/data.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [JsonDataService]
})
export class LayoutComponent implements OnInit {
  public isDarkTheme = false;
  public navList: any = [];

  constructor(private authenticationService: AuthenticationService,
    private router: Router, private data: Data, private viewContainerRef: ViewContainerRef, private JsonDataService: JsonDataService) { }

  ngOnInit() {
    let tokenVerification = JSON.parse(localStorage.getItem('currentUser'))['token'];
    this.JsonDataService.getNavLinks(tokenVerification)
      .subscribe(
      role => {
        if (role.success) {
          this.getdata(role.data);
        }
        else {
          tokenVerification = null;
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
          this.data.openSnackBar('Session Expired', 'Ok');
        }
      }, error => {
        tokenVerification = null;
        localStorage.removeItem('currentUser');
        this.data.openSnackBar('Session Expired', 'Ok');
        this.router.navigate(['/login']);

      });
    // this.JsonDataService.getNavLinks().subscribe(resJsonData => this.getdata(resJsonData));
  }

  // getdata for navigations
  getdata(jsonData: any) {
    this.navList = jsonData;
  }
  toggleTheme() {
    if (this.isDarkTheme === true) {
      this.isDarkTheme = false;
    } else {
      this.isDarkTheme = true;
    }
  }

  profile() {
    this.router.navigate(['/home']);
  }

  // on logout click
  logout() {
    this.authenticationService.logout();
    this.data.openSnackBar('Successfully', 'Logged Out');
  }
  changePassword() {
    this.router.navigate(['/home/passwordReset/reset']);
  }
}
