import { UserService } from './../../services/user.service';
import { AuthenticationService } from './../../services/authentication.service';
import { SamProfileCardService } from './../../services/sam-profile-card.service';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from './../../services/profile.service';
import { SamProfileSectionConfigService } from './../../services/sam-profile-section-config.service';
import { Md2Dialog } from 'md2';
//import { AppComponent } from 'app/app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ProfileService, SamProfileSectionConfigService, Md2Dialog]
})

export class DashboardComponent implements OnInit {
  profileSections: any[];
  profileData: Object;
  profileCardData: any;
  profileConfig: any;
  profileFormConfig: any;
  profileFormSections: any[];

  constructor(
    private dialog: Md2Dialog,
    // service for getting data for profile sections
    private SamProfileService: ProfileService,
    //Service for getting rendering config of profile sections
    private SamProfileSectionConfigService: SamProfileSectionConfigService,
    // service for providing sam profile card
    private SamProfileCardService: SamProfileCardService
  ) {
    // this will get the data for profile section according to usename
    this.profileData = SamProfileService.getProfileData(JSON.parse(localStorage.getItem('currentUser'))["username"]);

    // this will get the data for profile card according to username
    this.profileCardData = SamProfileCardService.getProfileCardData();

    // this will get the data for profile config
    this.profileConfig = SamProfileSectionConfigService.getProfileSectionConfig();

    // this will get the data for profile form config
    this.profileFormConfig = SamProfileSectionConfigService.getProfileSectionFormConfig();

    // this will provide all section related info
    this.profileSections = [
      { 'name': 'personalInfo', 'title': 'Personal Informations', 'align': 'column' },
      { 'name': 'skills', 'title': 'Skills Informations', 'align': 'column' }
    ];
    this.profileFormSections = [
      { 'name': 'personalInfo', 'title': 'Personal Informations Form', 'align': 'row' },
      { 'name': 'skills', 'title': 'Skills Informations Form', 'align': 'row' }
    ];
  }

  public currentSectionTitle: string;
  public currentSectionAlign: string;
  public currentSectionName: string;



  onEdit(dialog: Md2Dialog, sectionName: string) {
    this.profileFormSections.forEach(section => {
      if (section.name == sectionName) {
        this.currentSectionName = sectionName;
        this.currentSectionTitle = section.title;
        this.currentSectionAlign = section.align;
      }
    });
    dialog.open();
  }


  onSave(sectionName: string) {
    console.log(sectionName);
  }

  ngOnInit() { }

  // this will provide section config for perticular sections from profile config section
  getSectionConfig(sectionName: string) {
    return this.profileConfig[sectionName];
  }
  getSectionFormConfig(sectionName: string) {
    return this.profileFormConfig[sectionName];
  }

  // this will provide section data for perticular sections from profile service
  getSectiondata(sectionName: string) {
    return this.profileData[sectionName];
  }
}
