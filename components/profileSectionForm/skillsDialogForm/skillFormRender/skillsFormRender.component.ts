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
  selector: 'skills-form-render',
  templateUrl: './skillsFormRender.component.html',
  styleUrls: ['./skillsFormRender.component.css']
})
export class SkillsFormRender implements OnInit {

  public userForm: FormGroup;

  @Input()
  public skillsData: any[];

  public skills: any[] = this.getSkills();
  
  levels = [
    { name: 'BEGINNER', value: 'Beginner' },
    { name: 'MODERATE', value: 'Moderate' },
    { name: 'EXPERT', value: 'Expert' },
  ];

  constructor(private fb: FormBuilder, private http: Http, private router: Router, private data: Data,private authenticationService:AuthenticationService) {
  }

  ngOnInit() {
    if (this.skillsData.length > 0) {
      this.userForm = this.fb.group({
        AllSkills: this.fb.array(this.initSkillsFormWithData())
      });
    } else {
      this.userForm = this.fb.group({
        AllSkills: this.fb.array([this.initSkillsForm()])
      });
    }
  }

  initSkillsFormWithData() {
    let skillEntries = this.skillsData.map((skill) => {
      return this.fb.group({
        name: [skill.name, [Validators.required]],
        experience: [skill.experience],
        expertise: [skill.expertise],
      });
    });

    return skillEntries;
  }

  //to get the form 
  initSkillsForm() {
    return this.fb.group({
      name: ['', [Validators.required]],
      experience: [''],
      expertise: [''],
    });
  }

  addSkills() {
    const control = <FormArray>this.userForm.controls['AllSkills'];
    control.push(this.initSkillsForm());
  }

  removeSkills(i: number) {
    const control = <FormArray>this.userForm.controls['AllSkills'];
    control.removeAt(i);
  }
  onSave() {
    let sectionName = 'skills';
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    this.http.patch('/profile', { sectionName: sectionName, username: currentuser.username, data: this.userForm.value.AllSkills, token:this.authenticationService.getToken() })
      .subscribe((response) => {
        let res = response.json();
        this.authenticationService.setToken(res.authToken);
        if (res.success) {
          this.data.openSnackBar('Successfully updated', 'OK');
          this.router.navigate(['/login']);

        }
        else {
          this.data.openSnackBar('Skills Updated', 'OK');
          this.router.navigate(['/login']);

        }

      }, (err) => {
        this.data.openSnackBar('Technical Error', 'Try again');

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


}

