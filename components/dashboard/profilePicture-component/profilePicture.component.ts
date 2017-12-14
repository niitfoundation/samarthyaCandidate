import { ProfilePictureRender } from './profilePictureRender/profilePictureRender.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
  
@Component({
  selector: 'prof-pic',
  templateUrl: './profilePicture.component.html'
  // styleUrls: ['./profilePicture.component.css']
})

export class ProfilePictureComponent implements OnInit {
  public profilePictureUrl: any[];
  
  constructor(public dialogRef: MdDialogRef<ProfilePictureComponent>) {}

  ngOnInit() {
    this.profilePictureUrl = this.dialogRef.config.data;
    console.log(Array.isArray(this.profilePictureUrl));
  }
  
}