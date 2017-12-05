import { Component, OnInit, Inject, } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { JsonDataService } from './../../../services/json-data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { EmailService } from './../../../services/email.service';
import { Logger } from 'angular2-logger/core';
import { AuthenticationService } from './../../../services/authentication.service';
import { Data } from './../../../services/data.service';

@Component({
  selector: 'app-candidate-register',
  templateUrl: './candidate-register.component.html',
  styleUrls: ['./candidate-register.component.css'],
  providers: [JsonDataService]
})
export class CandidateRegisterComponent implements OnInit {

  public profession: any = [];
  public placementCenter: any = [];
  public userForm: FormGroup;
  public formData = {};
  public pincode: string;
  public pincodeLocation: any;
  public areaList: any = [];
  public password = '';
  public passwordMatchWarning = '';
  public checkUserEmail: any;
  public loading = true;
  public emailDisable = false;
  public createdBy: any;
  public district: any;
  public state: any;
  public landmark: any;

  constructor( @Inject(FormBuilder) fb: FormBuilder, private authenticationService: AuthenticationService, private JsonDataService: JsonDataService, private route: ActivatedRoute,
    private router: Router, private http: Http, private emailService: EmailService, private data: Data,
    private snackBar: MdSnackBar, private viewContainerRef: ViewContainerRef, private logger: Logger) {

    // register candidate form
    this.userForm = fb.group({
      name: ['', [Validators.required,Validators.pattern('[A-Za-z0-9 ]{2,30}')]],
      fname: ['', [Validators.required,Validators.pattern('[A-Za-z ]{2,30}')]],
      lname: ['', [Validators.required,Validators.pattern('[A-Za-z ]{1,30}')]],
      gender: ['male', Validators.required],
      email: ['', Validators.required],
      regId: ['', [Validators.required,Validators.pattern(/^R\d{2}F\d{9}$/)]],
      dob: ['', Validators.required],
      aadhar: ['', [Validators.pattern(/^\d{12}$/)]],
      mob: ['', [Validators.required, , Validators.pattern('[0-9]{10}')]],
      role: ['candidate'],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,24}$/)]],
      conPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,24}$/)]],
      profession: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      location: ['', Validators.required],
      placementCenter: ['', [Validators.required]]
    });
  }

  minDate: Date = null;
  maxDate: Date = null;

  ngOnInit() {

    let today: Date = new Date();
    this.maxDate = new Date(today);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);
    // getting languages and form data from json file
    this.JsonDataService.getPlacementCenter().subscribe((resJsonData: any) => this.getPlacementCenter(resJsonData));

    this.JsonDataService.getProfession().subscribe((resJsonData: any) => this.getProfession(resJsonData));

    this.JsonDataService.verifyToken(this.route.snapshot.queryParams['confirm']).subscribe((res: any) => {
      if (res.msg != 'Session Expired') {
        if (res.data.username) {
          this.userForm.patchValue({
            'email': res.data.username
          })
          this.emailDisable = true;
        }
        this.verifyUser(this.userForm.value.email);
      }
      else {
        this.router.navigate(['/login']);
        this.data.openSnackBar(res.msg['msg'], "OK");
      }
    },
      (err) => {
        this.router.navigate(['/login']);
        this.data.openSnackBar("Session Expired", "OK");
      })

  }

  // check if email is undefined or already exists
  verifyUser(email: any) {
    this.JsonDataService.verifyUser(email).subscribe((resJsonData: any) => {
      if (resJsonData['msg'] === 'user not exist') {
        this.loading = false;
      } else if (resJsonData['msg'] === 'user already exist') {
        this.router.navigate(['/login']);
      }
    });
  }

  // redirect if user is undefined or already registered
  redirectInvalidUser(email: any) {
    if (email === undefined || this.checkUserEmail[0] === 'found') {
      this.logger.error('Invaild Email id, redirected to login');
      this.router.navigate(['/login']);
      // this.loading = false;

    } else {
      this.loading = false;
    }
  }

  // Getting placement Centers
  getPlacementCenter(jsonData: any) {
    this.placementCenter = jsonData;
  }

  // Getting Professions
  getProfession(jsonData: any) {
    this.profession = jsonData;
  }

  conPasswordValue(conPass: string,pass:string) {
    this.password = pass;
    if (this.password !== conPass) {
      this.passwordMatchWarning = 'Password Not Match';
      (<HTMLInputElement>document.getElementById('resetBtn')).disabled = true;
    } else {
      this.passwordMatchWarning = '';
    }
  }

  // check Pincode
  getPincode() {
    if (this.pincode == undefined) {
    } else if (this.pincode.length === 6) {
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
      this.data.openSnackBar('No Location Found', 'Please Try again');
    } else {
      this.data.openSnackBar(this.pincodeLocation.count + ' Locations Found', 'Please Select');
    }
  }

  // on form submit
  onRegister(userdata: any) {
    let dobOfUser = new Date(userdata.get('dob').value) ;
   dobOfUser.setDate(dobOfUser.getDate() + 1);
    this.loading = true;
    // check who is creating user
    let createdUser = this.authenticationService.getCreatedBy();
    if (createdUser == null) {
      this.createdBy = this.userForm.value.email;
    } else {
      this.createdBy = createdUser;
    }

    this.landmark = userdata.get('location').value.split(',')[0];
    this.district = userdata.get('location').value.split(',')[1];
    this.state = userdata.get('location').value.split(',')[2];
    let profilePic = '';
    if (userdata.get('gender').value == 'male') {
      profilePic = 'assets/img/male.jpg';
    } else if (userdata.get('gender').value == 'female') {
      profilePic = 'assets/img/female.jpg';
    }
    let userData = {
      profileData: {
        summary: {
          summaryText: ''
        },
        personalInfo: {
          name: userdata.get('name').value,
          fname: userdata.get('fname').value,
          lname: userdata.get('lname').value,
          gender: userdata.get('gender').value,
          dob: dobOfUser,
          email: userdata.get('email').value,
          contact: {
            I: userdata.get('mob').value
          },
          role: userdata.get('role').value,
          address: {
            address1: '',
            address2: '',
            pincode: userdata.get('pincode').value,
            district: this.district,
            landmark: this.landmark,
            state: this.state
          },
          identity: [{ idType: "Aadhaar", value: userdata.get('aadhar').value },
          { idType: "RegNumber", value: userdata.get('regId').value }]

        },

        username: userdata.get('email').value,
        profession: userdata.get('profession').value,
        centerCode: userdata.get('placementCenter').value,
        createdBy: this.createdBy,
        profilePic: profilePic,
      },
      userCredentialsData: {
        username: userdata.get('email').value, password: userdata.get('password').value,
        role: userdata.get('role').value,
      }
    };

    this.JsonDataService.registerUser(userData).subscribe((res: any) => {
      if (res['success']) {
        this.data.openSnackBar('Successfully Register', 'Please Login');
        this.loading = false;
        this.router.navigate(['/login']);
      } else {
        this.data.openSnackBar('Registration Failed', 'Please Try Again');
        this.loading = false;
      }
    }, (error: any) => {
      this.data.openSnackBar('Registration Failed', 'Please Try Again');
      this.loading = false;

    })
  }
}
