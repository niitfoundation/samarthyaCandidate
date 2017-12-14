import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Data } from './../../../../services/data.service';
import {AuthenticationService} from './../../../../services/authentication.service'

@Component({
  selector: 'prof-pic-render',
  templateUrl: './profilePictureRender.component.html',
  styleUrls: ['./profilePictureRender.component.css']
})

export class ProfilePictureRender implements OnInit{
	public userForm: FormGroup;

    @Input()
    public profilePicture: any[]; 

  	constructor(private fb: FormBuilder, private http: Http, private router: Router, private data: Data, private authenticationService:AuthenticationService) {
  	}

  	ngOnInit(){
      console.log(Array.isArray(this.profilePicture));
  		if (this.profilePicture.length > 0) {
      this.userForm = this.fb.group({
        profile: this.fb.array(this.initPictureUrlWithData())
      });
      } else {
      this.userForm = this.fb.group({
        profile: this.fb.array([this.initPictureUrl()])
        });
      }
  	}
	
  initPictureUrlWithData() {
    let pictureUrl = this.profilePicture.map((picUrl) => {
      return this.fb.group({
        profilePicUrl: [picUrl]
      });
    });
    return pictureUrl;
  }

  initPictureUrl(){
    return this.fb.group({
        profilePicUrl: ['']
    });
  }

  onSave() {
    let picture: any[] = [];
    this.userForm.value.profile.forEach(function (d: any) {
      let url = {'profilePic': d.profilePicUrl}
      picture.push(url);
     })
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    this.http.patch('/profile/profilePic', {username: currentuser.username, data: picture[0].profilePic, token:this.authenticationService.getToken() })
      .subscribe((response) => {
        let res = response.json();
        this.authenticationService.setToken(res.authToken);
        if (res.success) {
          this.data.openSnackBar('Successfully updated ', 'OK');
          this.router.navigate(['/login']);

        }
        else {
          this.data.openSnackBar('Profile Picture Updated', 'OK');
          this.router.navigate(['/login']);
        }

      }, (err) => {
        this.data.openSnackBar('Technical Error', 'Try again');
      });

  }
}
