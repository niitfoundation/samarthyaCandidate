import { Component, OnInit, Inject, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Data } from './../../../../services/data.service';
import { Location } from '@angular/common';
import {AuthenticationService} from './../../../../services/authentication.service'


@Component({
  selector: 'workExperience-form-render',
  templateUrl: './workExperienceFormRender.component.html',
  styleUrls: ['./workExperienceFormRender.component.css']
})
export class WorkExperienceFormRender implements OnInit {

  public userForm: FormGroup;

  @Input()
  public workExperienceData: any[];

  public jobRoles: any[] = this.getJobRoles();
  public locations: any[] = this.getLocations();
  
  constructor(private fb: FormBuilder, private location: Location, private http: Http, private router: Router, private data: Data, private authenticationService:AuthenticationService) {
  }

  minDate: Date = null;
  maxDate: Date = null;

  ngOnInit() {

    let today: Date = new Date();
    // this.minDate = new Date(today);
    // this.minDate.setMonth(this.minDate.getMonth() - 3);

    this.maxDate = new Date(today);
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    if (this.workExperienceData.length > 0) {
      this.userForm = this.fb.group({
        AllWorkExperience: this.fb.array(this.initWorkExperiencesFormWithData())
      });
    } else {
      this.userForm = this.fb.group({
        AllWorkExperience: this.fb.array([this.initWorkExperiencesForm()])
      });
    }
  }

  initWorkExperiencesFormWithData() {
    let workExperienceEntries = this.workExperienceData.map((experience) => {
      return this.fb.group({
        workplace: [experience.workplace, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        designation: [experience.designation, [ Validators.pattern('^[a-zA-Z\\s]*$')]],
        jobRole: [experience.jobRole, [ Validators.pattern('^[a-zA-Z\\s]*$')]],
        lastSalary: [experience.lastSalary],
        location: [experience.location, [ Validators.pattern('^[a-zA-Z\\s]*$')]],
        from: [experience.duration.start],
        till: [experience.duration.end],
        iscurrent: [experience.status]
      });
    });

    return workExperienceEntries;
  }

  // to get the form 
  initWorkExperiencesForm() {
    return this.fb.group({
      workplace: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      designation: ['', [ Validators.pattern('^[a-zA-Z\\s]*$')]],
      jobRole: ['', [ Validators.pattern('^[a-zA-Z\\s]*$')]],
      lastSalary: [''],
      location: ['', [ Validators.pattern('^[a-zA-Z\\s]*$')]],
      from: [''],
      till: [''],
      iscurrent: ['']
    });
  }

  addWorkExperience() {
    const control = <FormArray>this.userForm.controls['AllWorkExperience'];
    control.push(this.initWorkExperiencesForm());
  }

  removeWorkExperience(i: number) {
    const control = <FormArray>this.userForm.controls['AllWorkExperience'];
    control.removeAt(i);
  }
  onSave() {
    let sectionName = 'experiences';
    let experience: any = [];
    this.userForm.value.AllWorkExperience.forEach(function (d: any) {
      let obj = { 'workplace': d.workplace, 'duration': { 'start': d.from, 'end': d.till }, 'designation': d.designation, 'jobRole': d.jobRole, 'lastSalary': d.lastSalary, 'iscurrent': d.iscurrent, 'location': d.location }
      experience.push(obj);
    })
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    this.http.patch('/profile', { sectionName: sectionName, username: currentuser.username, data: experience, token:this.authenticationService.getToken() })
      .subscribe((response) => {
        let res = response.json();
        this.authenticationService.setToken(res.authToken);
        if (res.success) {
          this.data.openSnackBar('Successfully updated', 'OK');
          this.router.navigate(['/login']);
        }
        else {
          this.data.openSnackBar('Not updated', 'Try later');
          this.router.navigate(['/login']);
        }

      }, (err) => {
        this.data.openSnackBar('Technical Error', 'Try again');

      });
  }
  getJobRoles(){
    let jobRoles : any = [];
    this.http.get('/roles').subscribe((response: Response) => {
      let data = response.json();
      data.forEach(function(roles: String){
        jobRoles.push(roles['name']);
      })
    })
    return jobRoles;
  }
  getLocations(){
    let locations : any = [];
    this.http.get('/locations').subscribe((response: Response) => {
      let data = response.json();
      data.forEach(function(location: String){
        locations.push(location['name']);
      })
    })
    return locations;
  }


}

