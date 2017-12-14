import { WorkExperienceFormRender } from './components/profileSectionForm/workExperienceForm/workExperienceFormRender/workExperienceFormRender.component';
import { SkillsFormRender } from './components/profileSectionForm/skillsDialogForm/skillFormRender/skillsFormRender.component';
import { WorkExperienceForm } from './components/profileSectionForm/workExperienceForm/workExperienceForm.component';
import { JobPreferenceFormRender } from './components/profileSectionForm/jobPreferenceForm/jobPreferenceFormRender/jobPreferenceFormRender.component';
import { JobPreferenceForm } from './components/profileSectionForm/jobPreferenceForm/jobPreferenceForm.component';
import { PlacementHistoryForm } from './components/profileSectionForm/placementHistoryForm/placementHistoryForm.component';
import { PlacementHistoryFormRender } from './components/profileSectionForm/placementHistoryForm/placementHistoryFormRender/placementHistoryFormRender.component';
import { SummaryForm } from './components/profileSectionForm/summaryForm/summaryForm.component';
import { ProjectsFormRender } from './components/profileSectionForm/projectsForm/projectsFormRender/projectsFormRender.component';
import { SkillsForm } from './components/profileSectionForm/skillsDialogForm/skillsForm.component';
import { MainComponent } from './mainComponent';
import { ModuleWithProviders } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { QualificationFormRender } from './components/profileSectionForm/qualificationForm/qualificationFormRender/qualificationFormRender.component';
import {AuthGuard} from './Guard/auth.guard';

// local services
import { UserService } from './services/user.service';
import { JsonDataService } from './services/json-data.service';
import { EmailService } from './services/email.service';
import { Data } from './services/data.service';
import { AuthenticationService } from './services/authentication.service';

// local components
import { VerifyEmailComponent } from './components/loginComponent/verify-email/verify-email.component';
import { PasswordResetComponent } from './components/loginComponent/password-reset/password-reset.component';
import { LoginHeaderComponent } from './components/loginComponent/login-header/login-header.component';
import { LoginFooterComponent } from './components/loginComponent/login-footer/login-footer.component';
import { ForgotPasswordComponent } from './components/loginComponent/forgot-password/forgot-password.component';
import { LoginComponent } from './components/loginComponent/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CandidateRegisterComponent } from './components/loginComponent/candidate-register/candidate-register.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PersonalInfoForm } from './components/profileSectionForm/personalInfoForm/personalInfoForm.component';
import { ProjectsForm } from './components/profileSectionForm/projectsForm/projectsForm.component';
import { QualificationForm } from './components/profileSectionForm/qualificationForm/qualificationForm.component';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Md2Module } from 'md2';
import { SamarthyaWebComponentsModule } from 'samarthyaWebcomponent';
import { SamProfileCardService } from 'samarthyaWebcomponent/sam-profile/sam-profile-card/sam-profile-card.service';
import { SamProfileSectionConfigService } from 'samarthyaWebcomponent/sam-profile/sam-profile-section/sam-profile-section-config.service';
import { ProfileService } from 'samarthyaWebcomponent/sam-profile/sam-profile-section/sam-profile-section-data.service';
import { SamProfileSectionFormComponent } from 'samarthyaWebcomponent/sam-profile/sam-profile-section-form/sam-profile-section-form.component';
import { SamProfileSectionComponent } from 'samarthyaWebcomponent/sam-profile/sam-profile-section/sam-profile-section.component';
import { SamProfileCardComponent } from 'samarthyaWebcomponent/sam-profile/sam-profile-card/sam-profile-card.component';
import { ProfilePictureComponent } from './components/dashboard/profilePicture-component/profilePicture.component';
import { ProfilePictureRender } from './components/dashboard/profilePicture-component/profilePictureRender/profilePictureRender.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    Md2Module.forRoot(),
    ReactiveFormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    SamarthyaWebComponentsModule,
  ],
  declarations: [
    SkillsFormRender,
    SkillsForm,
    AboutUsComponent,
    CandidateRegisterComponent,
    ProfilePictureComponent,
    ProfilePictureRender,
    DashboardComponent,
    LayoutComponent,
    LoginComponent,
    CandidateRegisterComponent,
    ForgotPasswordComponent,
    LoginFooterComponent,
    LoginHeaderComponent,
    PasswordResetComponent,
    VerifyEmailComponent,
    MainComponent,
    routingComponents,
    PersonalInfoForm,
    QualificationForm,
    WorkExperienceForm,
    SummaryForm,
    JobPreferenceForm,
    JobPreferenceFormRender,
    ProjectsFormRender,
    ProjectsForm,
    PlacementHistoryForm,
    QualificationFormRender,
    PlacementHistoryFormRender,
    WorkExperienceFormRender
  ],
  bootstrap: [MainComponent, PersonalInfoForm, SkillsForm, WorkExperienceForm, SummaryForm, JobPreferenceForm, ProjectsForm, QualificationForm, PlacementHistoryForm, ProfilePictureComponent],
  exports: [
    SkillsForm,
    SkillsFormRender,
    AboutUsComponent,
    DashboardComponent,
    LayoutComponent,
    LoginComponent,
    ProfilePictureComponent,
    ProfilePictureRender,
    CandidateRegisterComponent,
    ForgotPasswordComponent,
    LoginFooterComponent,
    LoginHeaderComponent,
    PasswordResetComponent,
    VerifyEmailComponent,
    MainComponent,
    routingComponents,
    SamProfileCardComponent,
    SamProfileSectionComponent,
    SamProfileSectionFormComponent,
    PersonalInfoForm,
    QualificationForm,
    WorkExperienceForm,
    SummaryForm,
    JobPreferenceForm,
    PlacementHistoryForm,
    ProjectsForm,
    JobPreferenceFormRender,
    ProjectsFormRender,
    PlacementHistoryFormRender,
    QualificationFormRender,
    WorkExperienceFormRender
  ]
})

export class CandidateModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CandidateModule,
      providers: [
        AuthenticationService,
        AuthGuard,
        Data,
        EmailService,
        JsonDataService,
        ProfileService,
        UserService,
        SamProfileCardService,
        SamProfileSectionConfigService,
      ]
    }
  }
}
