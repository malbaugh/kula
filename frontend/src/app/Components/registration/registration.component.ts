import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { Observable } from 'rxjs';
import { startWith, map, take } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { STATES } from 'src/Data/Information/States';
import { User } from 'src/Helpers/Users/Classes/User';
import { ValidateDob } from 'src/Helpers/Validators/OverEighteen';
import { PasswordValidation } from 'src/Helpers/Validators/Password';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public user!: User;
  public returnUrl!: string;
  public isLinear = true; // Set false for easier debugging
  public hide = true;
  public hide2 = true;
  public states = STATES;
  public registered = false;
  public dataLoaded = false;
  public organization = false;
  public selection!: string;
  @ViewChild(MatStepper) stepper!: MatStepper;
  public address!: string;
  public name!: string;
  public registrationCount!: number;
  public regForm!: FormGroup;

  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public ngZone: NgZone,
    public currentUserService: CurrentUserService,
    public usersService: UsersService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private gtmService: GoogleTagManagerService,
  ) {

    this.currentUserService.UserLocation = "/registration";
    if (this.currentUserService.CurrentUserValue) { 
      this.router.navigate(['/welcome/']);
    }
  }

  ngOnInit() {
    this.currentUserService.RecordEvent("button-click","The registration component was opened","registration").subscribe(data => {});

    this.regForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      password: this.fb.group({
        password1: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        password2: ['', [Validators.required]]},
        { validator: PasswordValidation.MatchPassword.bind(this) }),
      email: ['', [Validators.required, Validators.email]],
      location: this.fb.group({
        addressOne: ['', Validators.required],
        addressTwo: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipcode: ['', Validators.required]})
    });

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public validateMinMax(min: number, max: number) {
    return ['', [
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern('[0-9]+')  // validates input is digit
    ]]
  }

  // Convenience getter for easy access to form fields
  public get form() { return this.regForm.controls; }

  // Getters so we can get each control for error messages in form
  public get firstName() { return this.regForm.get('firstName'); }
  public get lastName() { return this.regForm.get('lastName'); }
  public get password() { return this.regForm.get('password'); }
  public get password1() { return this.regForm.get('password.password1'); }
  public get password2() { return this.regForm.get('password.password2'); }
  public get email() { return this.regForm.get('email'); }
  public get addressOne() { return this.regForm.get('location.addressOne'); }
  public get addressTwo() { return this.regForm.get('location.addressTwo'); }
  public get city() { return this.regForm.get('location.city'); }
  public get state() { return this.regForm.get('location.state'); }
  public get zipcode() { return this.regForm.get('location.zipcode'); }

  public OnSubmitRegistration() {
    this.currentUserService.RecordEvent("conversion","User registered","registration").subscribe(data => {});

    this.dataLoaded = false;

    if (this.organization) {
      this.name = this.firstName?.value;

    } else {
      if (this.lastName?.value == "") {
        this.name = this.firstName?.value;
      } else {
        this.name = this.firstName?.value.concat(', ').concat(this.lastName?.value);
      }
    }
    
    if (this.addressTwo?.value == "") {
      this.address = this.addressOne?.value;
    } else {
      this.address = this.addressOne?.value.concat(', ').concat(this.addressTwo?.value);
    }
    
    this.user = new User(
      0,
      this.name,
      this.email?.value,
      this.organization,
      this.address,
      this.city?.value,
      this.state?.value,
      +this.zipcode?.value,
      5
    );

    this.usersService.RegisterUser(this.user, this.password1?.value).subscribe(
      data => {
      },
      error => {
        this.dataLoaded = true;
        this.stepper.next();
        this.ReportError("registration method OnAgree() error (register) ");
      },
      () => this.currentUserService.Login(this.user.Email, this.password1?.value).subscribe(
        data => {
          this.dataLoaded = true;
          this.currentUserService.UserLocation = "";
          this.router.navigate(['/welcome/']);
        },
        error => {
          this.dataLoaded = true;
          this.stepper.next();
          this.ReportError("registration method OnAgree() error (login) ");
        }
      )
    );
  }

  public OnAgree() {
  }

  public ReportError(errorReport: string) {
    this.usersService.ReportIssue(errorReport,this.user.Email).subscribe(
      data => {
        this.dataLoaded = true;
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }
}
