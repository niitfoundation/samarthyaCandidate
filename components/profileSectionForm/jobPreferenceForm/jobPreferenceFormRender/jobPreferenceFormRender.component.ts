import { Component, OnInit, Inject, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Data } from './../../../../services/data.service';
import {AuthenticationService} from './../../../../services/authentication.service'

@Component({
  selector: 'jobPreference-form-render',
  templateUrl: './jobPreferenceFormRender.component.html',
  styleUrls: ['./jobPreferenceFormRender.component.css']
})
export class JobPreferenceFormRender implements OnInit {

  public userForm: FormGroup;

  public jobRoles: any[] = this.getJobRoles();
  public skills: any[] = this.getSkills();

  @Input()
  public jobPreferenceData: any[];

  public engagementData = ['Full Time', 'Part Time', 'Flexible'];
  public locationData = ['Bangalore', 'Pune', 'Delhi', 'Gurgaon', 'Chennai'];
  public shiftData = ['General Shift', 'Morning Shift', 'Evening Shift', 'Overnight Shift'];

  constructor(private fb: FormBuilder, private http: Http, private router: Router, private data: Data, private AuthenticationService:AuthenticationService) {
  }

  minDate: Date = null;
  maxDate: Date = null;


  ngOnInit() {

    let today: Date = new Date();
    // this.minDate = new Date(today);
    // this.minDate.setMonth(this.minDate.getMonth() - 3);

    this.maxDate = new Date(today);
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    if (this.jobPreferenceData.length > 0) {
      this.userForm = this.fb.group({
        AllJobPreference: this.fb.array(this.initJobsPreferenceFormWithData())
      });
    } else {
      this.userForm = this.fb.group({
        AllJobPreference: this.fb.array([this.initJobPreferenceForm()])
      });
    }
  }

  initJobsPreferenceFormWithData() {
    let jobPreferenceEntries = this.jobPreferenceData.map((jobPreference) => {
      return this.fb.group({
        name: [jobPreference.name, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        engagement: [jobPreference.engagement, [Validators.pattern(/[a-z]/)]],
        shift: [jobPreference.shift, [ Validators.pattern(/[a-z]/)]],
        expectedSalMin: [jobPreference.expectedSal.min, [ Validators.pattern(/[0-9]/)]],
        expectedSalMax: [jobPreference.expectedSal.max, [ Validators.pattern(/[0-9]/)]],
        skills: [jobPreference.skills],
        availableFrom: [jobPreference.availablefrom],
        locations: [jobPreference.locations]
      });
    });

    return jobPreferenceEntries;
  }

  //to get the form
  initJobPreferenceForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      engagement: ['', [ Validators.pattern(/[a-z]/)]],
      shift: ['', [ Validators.pattern(/[a-z]/)]],
      expectedSalMin: ['', [ Validators.pattern(/[0-9]/)]],
      expectedSalMax: ['', [ Validators.pattern(/[0-9]/)]],
      skills: [''],
      availableFrom: [''],
      locations: ['']
    });
  }

  addJobPreference() {
    const control = <FormArray>this.userForm.controls['AllJobPreference'];
    control.push(this.initJobPreferenceForm());
  }

  removeJobPreference(i: number) {
    const control = <FormArray>this.userForm.controls['AllJobPreference'];
    control.removeAt(i);
  }
  onSave() {
    let sectionName = "jobPreferences";
    let jobs: any = [];
    this.userForm.value.AllJobPreference.forEach(function (d: any) {
      let skill:any =[];
      if (d.skills.includes(',')) {
        skill = d.skills.split(',');
      }
      else {
         if(typeof d.skills == typeof '')
        skill.push(d.skills);
        else
        skill=d.skills;
      }

      let obj = { 'name': d.name, 'expectedSal': { 'min': d.expectedSalMin, 'max': d.expectedSalMax }, 'engagement': d.engagement, 'shift':d.shift, 'skills': skill, 'availablefrom': d.availableFrom, 'locations': d.locations }
      jobs.push(obj);
    })
    let jobPref = { looking: true, jobRoles: jobs }
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    this.http.patch('/profile', { sectionName: sectionName, username: currentuser.username, data: jobPref,token:this.AuthenticationService.getToken() })
      .subscribe((response) => {
        let res = response.json();
        this.AuthenticationService.setToken(res.authToken);
        if (res.success) {
          this.data.openSnackBar("Successfully updated", "OK");
          this.router.navigate(['/login']);
        }
        else {
          this.data.openSnackBar("Not updated", "Try later");

        }

      }, (err) => {
        this.data.openSnackBar("Technical Error", "Try again");

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

  getSkills(){
    let skills : any = [];
    this.http.get('/skills').subscribe((response: Response) => {
      let data = response.json();
      data.forEach(function(skill: String){
        skills.push(skill['name']);
      })
    })
    return skills;
  }

}

