import { Data } from './../../../../services/data.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import {AuthenticationService} from './../../../../services/authentication.service'


@Component({
  selector: 'qualification-form-render',
  templateUrl: './qualificationFormRender.component.html',
  styleUrls: ['./qualificationFormRender.component.css'],
})

export class QualificationFormRender implements OnInit {
  public userForm: FormGroup;

  @Input()
  public qualificationsData: any[];

  public qualifications: any[] = this.getQualifications();
  public academictypes: any[] = this.getAcademictypes();
  public subjects: any[] = this.getSubjects();
  public locations: any[] = this.getLocations();

  constructor(private fb: FormBuilder, private http: Http, private router: Router, private data: Data,private authenticationService:AuthenticationService) {
  }


  minDate: Date = null;
  maxDate: Date = null;


  ngOnInit() {


    let today: Date = new Date();
    // this.minDate = new Date(today);
    // this.minDate.setMonth(this.minDate.getMonth() - 3);

    this.maxDate = new Date(today);
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    console.log(this.qualificationsData)
    if (this.qualificationsData.length > 0) {
      this.userForm = this.fb.group({
        AllQualifications: this.fb.array(this.initQualificationsFormWithData())
      });
    } else {
      this.userForm = this.fb.group({
        AllQualifications: this.fb.array([this.initQualificationsForm()])
      });
    }
  }

  initQualificationsFormWithData() {


    let qualificationEntries = this.qualificationsData.map((qualification) => {
      return this.fb.group({
        name: [qualification.name, [Validators.required]],
        subject: [qualification.subject],
        academictype: [qualification.academictype],
        batch: [qualification.batch.substring(0, 10)],
        result: [qualification.result],
        institute: [qualification.institute],
        affiliation: [qualification.affiliation],
        location: [qualification.location, [Validators.pattern('^[a-zA-Z\\s]*$')]],
      });
    });

    return qualificationEntries;
  }

  initQualificationsForm() {
    console.log("cccc")
    return this.fb.group({
      name: ['', [Validators.required]],
      subject: [''],
      academictype: ['', [Validators.required]],
      batch: [''],
      result: [''],
      institute: [''],
      affiliation: [''],
      location: ['', [Validators.pattern('^[a-zA-Z\\s]*$')]],
    });
  }
  addQualifications() {
    const control = <FormArray>this.userForm.controls['AllQualifications'];
    control.push(this.initQualificationsForm());
  }

  removeQualifications(i: number) {
    const control = <FormArray>this.userForm.controls['AllQualifications'];
    control.removeAt(i);
  }


  onSave() {
    let sectionName = "qualifications";
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    this.http.patch('/profile', { sectionName: sectionName, username: currentuser.username, data: this.userForm.value.AllQualifications, token:this.authenticationService.getToken() })
      .subscribe((response) => {
        let res = response.json();
        this.authenticationService.setToken(res.authToken)
        if (res.success) {
          this.data.openSnackBar("Successfully updated", "OK");
          this.router.navigate(['/login']);
        }
        else {
          this.data.openSnackBar("Not updated", "Try later");
          this.router.navigate(['/login']);
        }

      }, (err) => {
        this.data.openSnackBar("Technical Error", "Try again");

      });

  }

  getQualifications(){
    let qualifications : any = [];
    this.http.get('/qualifications').subscribe((response: Response) => {
      let data = response.json();
      data.forEach(function(qualification: String){
        qualifications.push(qualification['name']);
      })
    })
    return qualifications;
  }

  getAcademictypes(){
    let academictypes : any = [];
    this.http.get('/qualifications/academictypes').subscribe((response: Response) => {
      let data = response.json();
      data.forEach(function(academictype: String){
        academictypes.push(academictype);
      })
    })
    return academictypes;
  }

  getSubjects(){
    let subjects : any = [];
    this.http.get('/qualifications/subjects').subscribe((response: Response) => {
      let data = response.json();
      data.forEach(function(subject: String){
        subjects.push(subject);
      })
    })
    return subjects;
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
