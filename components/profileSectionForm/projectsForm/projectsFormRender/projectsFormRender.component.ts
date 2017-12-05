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
  selector: 'projects-form-render',
  templateUrl: './projectsFormRender.component.html',
  styleUrls: ['./projectsFormRender.component.css']
})
export class ProjectsFormRender implements OnInit {

  public userForm: FormGroup;

  @Input()
  public projectsData: any[];

  public skills: any[] = this.getSkills();
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

    if (this.projectsData.length > 0) {
      this.userForm = this.fb.group({
        AllProjects: this.fb.array(this.initProjectsFormWithData())
      });
    } else {
      this.userForm = this.fb.group({
        AllProjects: this.fb.array([this.initProjectsForm()])
      });
    }
  }

  initProjectsFormWithData() {
    let projectsEntries = this.projectsData.map((project) => {
      return this.fb.group({
        name: [project.name, [Validators.required]],
        durFrom: [project.duration.start, [Validators.required]],
        durTo: [project.duration.end, [Validators.required]],

        location: [project.location, [Validators.required]],
        skills: [project.skills, [Validators.required]],
        jobRole: [project.jobRole, [Validators.required]]
      });
    });

    return projectsEntries;
  }

  //to get the form
  initProjectsForm() {
    return this.fb.group({
      name: ['', [Validators.required]],
      durFrom: ['', [Validators.required]],
      durTo: ['', [Validators.required]],

      location: ['', [Validators.required]],
      skills: ['', [Validators.required]],
      jobRole: ['', [Validators.required]]
    });

  }

  addProject() {
    const control = <FormArray>this.userForm.controls['AllProjects'];
    control.push(this.initProjectsForm());
  }

  removeProject(i: number) {
    const control = <FormArray>this.userForm.controls['AllProjects'];
    control.removeAt(i);
  }
  onSave() {
    let sectionName = "projects";
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));

    let projects: any = [];
    this.userForm.value.AllProjects.forEach(function (d: any) {
      let skill:any= [];
      if (d.skills.includes(',')) {
        skill = d.skills.split(',');
      }
      else {
        if(typeof d.skills == typeof '')
        skill.push(d.skills);
        else
        skill=d.skills;
      }
      let obj = { 'name': d.name, 'duration': { 'start': d.durFrom, 'end': d.durTo }, 'location': d.location, 'skills': skill, 'jobRole': d.jobRole }
      projects.push(obj);
    })
    this.http.patch('/profile', { sectionName: sectionName, username: currentuser.username, data: projects,token :this.authenticationService.getToken() })
      .subscribe((response) => {
        let res = response.json();
        this.authenticationService.setToken(res.authToken);
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

