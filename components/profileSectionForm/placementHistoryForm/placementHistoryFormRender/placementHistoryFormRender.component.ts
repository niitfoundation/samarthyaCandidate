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
  selector: 'placementHistory-form-render',
  templateUrl: './placementHistoryFormRender.component.html',
  styleUrls: ['./placementHistoryFormRender.component.css']
})

export class PlacementHistoryFormRender implements OnInit {
selectedValue : String;
 public userForm: FormGroup;

  @Input()
  public placementHistoryData: any[];  

  public coordinatorNames : any[] = this.fetchCoordinators();

  public jobRoles: any[] = this.getJobRoles();

  public locations: any[] = this.getLocations();
  
  public placementTypeData = [
    { name: 'Yes', value: 'niit coordinator' },
    { name: 'No', value: 'self' }
  ];
  
  
  public options = [
    { name: 'IS IN PROGRESS', value: 'is in progress' },
    { name: 'HAS JOINED', value: 'has joined' },
    { name: 'NOT JOINED', value: 'not joined' }
  ];

  constructor(private fb: FormBuilder, private http: Http, private router: Router, private data: Data, private authenticationService:AuthenticationService) {
  }
 
  minDate: Date = null;
  maxDate: Date = null
  
  
  ngOnInit(){
    
    let today: Date = new Date();
    // this.minDate = new Date(today);
    // this.minDate.setMonth(this.minDate.getMonth() - 3);

    this.maxDate = new Date(today);
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    if (this.placementHistoryData.length > 0) {
      this.userForm = this.fb.group({
        AllPlacementHistory: this.fb.array(this.initPlacementHistoryFormWithData())
      });
    } else {
      this.userForm = this.fb.group({
        AllPlacementHistory: this.fb.array([this.initPlacementHistoryForm()])
      });
    }
  }


  initPlacementHistoryFormWithData() {
    let placementHistoryEntries = this.placementHistoryData.map((placementHistory) => {
      return this.fb.group({
        workplace: [placementHistory.workplace, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        designation: [placementHistory.designation, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        jobRole: [placementHistory.jobRole, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        location: [placementHistory.location, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        from: [placementHistory.duration.start, Validators.required],
        till: [placementHistory.duration.end, Validators.required],
        salary: [placementHistory.salary], //Max six digits, a dot, max two digits after dot
        placementType: [placementHistory.placementType, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        placementStatus: [placementHistory.placementStatus,[Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        coordinatorName: [placementHistory.coordinatorName],
        coordinatorContact: [placementHistory.coordinatorContact], // contact number with +91 - India Code
        placementRemarks: [placementHistory.placementRemarks, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        employerName: [placementHistory.employerName, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        employerContact: [placementHistory.employerContact],
        employerFeedback: [placementHistory.employerFeedback, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        iscurrent: [placementHistory.status]
      });
    });
    return placementHistoryEntries;
  }

  initPlacementHistoryForm() {
    return this.fb.group({
        workplace: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        designation: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        jobRole: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        location: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        from: ['', Validators.required],
        till: ['', Validators.required],
        salary: [''], //Max six digits, a dot, max two digits after dot
        placementType: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        placementStatus: [''],
        coordinatorName: ['',[Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]], 
        coordinatorContact: [''], // contact number with +91 - India Code
        placementRemarks: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        employerName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        employerContact: [''],
        employerFeedback: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        iscurrent: ['']
    });
  }

    addPlacementHistory() {
    const control = <FormArray>this.userForm.controls['AllPlacementHistory'];
    control.push(this.initPlacementHistoryForm());
    }

    removePlacementHistory(i: number) {
    const control = <FormArray>this.userForm.controls['AllPlacementHistory'];
    control.removeAt(i);
    }

    // coordinatorDetail(ans: string) {
    //   this.answer = ans;
    // }

    onSave() {
    let sectionName = 'placementHistory';
    let placementHistory: any = [];
    this.userForm.value.AllPlacementHistory.forEach(function (d: any) {
      let obj = { 'workplace': d.workplace, 'duration': { 'start': d.from, 'end': d.till }, 'designation': d.designation, 'jobRole': d.jobRole, 'iscurrent': d.iscurrent, 'location': d.location, 'salary': d.salary, 'placementType': d.placementType, 'placementStatus': d.placementStatus, 'coordinatorName': d.coordinatorName, 'coordinatorContact': d.coordinatorContact, 'placementRemarks': d.placementRemarks, 'employerName': d.employerName, 'employerContact': d.employerContact, 'employerFeedback': d.employerFeedback }
      placementHistory.push(obj);
    })
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    this.http.patch('/profile', { sectionName: sectionName, username: currentuser.username, data: placementHistory, token:this.authenticationService.getToken() })
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

    fetchCoordinators(){
      let coordinators : any = [];
      let profession : String;
      let currentuser = JSON.parse(localStorage.getItem('currentUser'));
      this.http.get('/profile?username=' + currentuser.username+'&token='+currentuser.token).subscribe((response: Response) => {
        let profileData = response.json();
        profileData = profileData['data'][0];
        profession = profileData.profession;
        let params = {role: 'Coordinator', professionArray: profession, page: 1, limit: 5};
        this.http.get('/coordinates?role='+params.role+'&professionArray='+params.professionArray+'&page='+params.page+'&limit='+params.limit).subscribe((res: Response)=>{
          let data : any = res.json();
          data.forEach(function(record:String){
            coordinators.push(record['personalInfo'].name);
          })  
        }) 
      })  
     return coordinators;
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

}

  