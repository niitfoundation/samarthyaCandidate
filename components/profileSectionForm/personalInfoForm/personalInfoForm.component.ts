import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { JsonDataService } from './../../../services/json-data.service';
import { Data } from './../../../services/data.service';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'personalInfo-form',
  templateUrl: './personalInfoForm.component.html',
  styleUrls: ['./personalInfoForm.component.css'],
  providers: [JsonDataService]

})
export class PersonalInfoForm implements OnInit {

  public userForm: FormGroup;
  public emailId = '';
  public pincode = this.dialogRef.config.data.address['pincode'];
  public pincodeLocation: any;
  public location = this.dialogRef.config.data.address.landmark + ','
  + this.dialogRef.config.data.address.district + ','
  + this.dialogRef.config.data.address.state;
  public emailDisable = false;
  public loc = 'asaasas';
  public areaList: any = [];

  public langList = [
    'English',
    'Hindi',
    'Panjabi',
    'Bengali',
    'Gujarati',
    'Malayalam',
    'Marathi',
    'Kannada',
    'Sindhi',
    'Tamil',
    'Urdu',
    'Sanskrit',
    'Telugu',
  ]
  // selectedValue: string = this.langList[0];
  public nativeLang: string = this.dialogRef.config.data.nativeLang;
  public prefLang: string = this.dialogRef.config.data.prefLang;
  // public address: string = this.dialogRef.config.data.address;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private JsonDataService: JsonDataService,
    private data: Data,
    public dialogRef: MdDialogRef<PersonalInfoForm>,
    private http: Http,
    private router: Router
  ) {
    this.userForm = fb.group({
      name: [this.dialogRef.config.data.name, [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      email: [this.dialogRef.config.data.email, [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      altemail: [this.dialogRef.config.data.altemail, [Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      mob: [this.dialogRef.config.data.contact['I'], [Validators.required, Validators.pattern('[0-9]{10}')]],
      phone: [this.dialogRef.config.data.contact['II'], [Validators.required, Validators.pattern('[0-9]{10}')]],
      dob: [this.dialogRef.config.data.dob, Validators.required],
      aadhar: [this.dialogRef.config.data.identity['aadhar'], [Validators.required, Validators.pattern('[0-9]{12}')]],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      location: ['', Validators.required],
      prefLang: ['', Validators.required],
      nativeLang: ['', Validators.required],
      readLang: ['', Validators.required],
      writeLang: ['', Validators.required],
      speakLang: ['', Validators.required],
    });
  }

  ngOnInit() {
    // console.log(this.dialogRef.config.data);
    console.log('-->>>', this.location);
    this.areaList[0] = this.location;
    // console.log()
  }

  // check Pincode
  getPincode() {
    if (this.pincode === undefined) {
    } else if (this.pincode.length === 6) {
      // this.loading = true;
      this.JsonDataService.getPincode(this.pincode).subscribe(
        (resPincodeData: any) => [this.pincodeLocation = resPincodeData, this.getPincodeLocation()]);
    } else if (this.pincode.length !== 6) {
      this.areaList = [];
      this.userForm.value.location = '';
    }
  }

  // get pincode locations after checking pincode
  getPincodeLocation() {
    let officeName;
    this.userForm.value.location = '';
    this.areaList = [];
    this.pincodeLocation.records.forEach((element: any) => {
      officeName = element['officename'];
      officeName = officeName.substr(0, officeName.length - 4);
      this.areaList.push(officeName + ', ' + element['Districtname'] + ', ' + element['statename']);
    });
    if (this.areaList.length === 0) {
      // this.loading = false;
      this.data.openSnackBar('No Location Found', 'Please Try again');
      // this.areaList.push('Area Not Found');
    } else {
      this.data.openSnackBar(this.pincodeLocation.count + ' Locations Found', 'Please Select');
      // this.loading = false;
      console.log(this.areaList.indexOf(this.location));
    }
  }

  onSave() {
    // console.log(this.userForm.value);

    let personalInfoData = this.dialogRef.config.data;
    personalInfoData.name = this.userForm.value.name;
    personalInfoData.email = this.userForm.value.email;
    personalInfoData.altemail = this.userForm.value.altemail;
    personalInfoData.contact.I = this.userForm.value.mob;
    personalInfoData.contact.II = this.userForm.value.phone;
    personalInfoData.address.landmark = this.userForm.value.location.split(',')[0];
    personalInfoData.address.district = this.userForm.value.location.split(',')[1];
    personalInfoData.address.state = this.userForm.value.location.split(',')[2];
    personalInfoData.address.pincode = this.userForm.value.pincode;
    personalInfoData.identity.aadhar = this.userForm.value.aadhar;
    personalInfoData.dob = this.userForm.value.dob;
    personalInfoData.prefLang = this.userForm.value.prefLang;
    personalInfoData.nativeLang = this.userForm.value.nativeLang;

    personalInfoData.lang = this.langModify(this.userForm.value.readLang, this.userForm.value.writeLang, this.userForm.value.speakLang);
    let username = JSON.parse(localStorage.getItem('currentUser'))['username'];

    this.http.patch('/profile', { data: personalInfoData, username: username, sectionName: 'personalInfo' })
      .subscribe((response: Response) => {
        console.log("-->", response['_body']);
        if (response['_body']) {
          console.log('yes');

          this.router.navigate(['/login']);
          this.data.openSnackBar('Successfully Updated', '');
        }
      });

  }



  langModify(read: Array<string>, write: Array<string>, speak: Array<string>) {
    let languages: any[] = [];
    let lang: any[] = [];
    read.forEach(element => {
      lang.push(element);
    });
    write.forEach(element => {
      lang.push(element);
    });
    speak.forEach(element => {
      lang.push(element);
    });
    lang = lang.filter((x, i, a) => a.indexOf(x) == i)
    lang.forEach(languageName => {
      let langObj = { name: languageName, r: false, w: false, s: false }
      languages.push(langObj);
    });
    languages.forEach(lang => {
      if (read.indexOf(lang.name) !== -1) {
        lang.r = true;
      }
      if (write.indexOf(lang.name) !== -1) {
        lang.w = true;
      }
      if (speak.indexOf(lang.name) !== -1) {
        lang.s = true;
      }
    });
    return languages
  }
}

