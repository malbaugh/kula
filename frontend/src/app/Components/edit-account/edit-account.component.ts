import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { User } from 'src/Helpers/Users/Classes/User';
import { STATES } from 'src/Data/Information/States';
import { PasswordValidation } from 'src/Helpers/Validators/Password';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  public accountForm!: FormGroup;
  public passForm!: FormGroup;

  public hide1 = true;
  public hide2 = true;
  public hide3 = true;
  public states = STATES;

  public phone: string = "";

  public changePass: boolean = false;
  
  public dataLoaded: boolean = false;
  
  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public ngZone: NgZone,
    public snackBar: MatSnackBar,
    public accountDialogRef: MatDialogRef<EditAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public currUser: User,
    public currentUserService: CurrentUserService,
    public usersService: UsersService
  ) { }

  ngOnInit() {
    this.passForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: this.fb.group({
        password1: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        password2: ['', [Validators.required]]},
        { validator: PasswordValidation.MatchPassword.bind(this) }),
    });

    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      location: this.fb.group({
        addressOne: ['', Validators.required],
        addressTwo: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipcode: ['', Validators.required]})
    });
    
    this.email?.setValue(this.currUser.Email);
    this.name?.setValue(this.currUser.FirstName.concat(" ").concat(this.currUser.LastName));

    var add1 = this.currUser.Address.split(", ")[0];
    var add2 = this.currUser.Address.split(", ")[1];
    this.addressOne?.setValue(add1);
    if (add2 != undefined) {
      this.addressTwo?.setValue(add2);
    }
    
    this.city?.setValue(this.currUser.City);
    this.state?.setValue(this.currUser.State);
    this.zipcode?.setValue(this.currUser.Zipcode);

    this.dataLoaded = true;
  }

  public validateMinMax(min: number, max: number) {
    return ['', [
      Validators.required,
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern('[0-9]+')  // validates input is digit
    ]]
  }

  public get password() { return this.passForm.get('password'); }
  public get oldPassword() { return this.passForm.get('oldPassword'); }
  public get password1() { return this.passForm.get('password.password1'); }
  public get password2() { return this.passForm.get('password.password2'); }

  public get email() { return this.accountForm.get('email'); }
  public get name() { return this.accountForm.get('name'); }
  public get addressOne() { return this.accountForm.get('location.addressOne'); }
  public get addressTwo() { return this.accountForm.get('location.addressTwo'); }
  public get city() { return this.accountForm.get('location.city'); }
  public get state() { return this.accountForm.get('location.state'); }
  public get zipcode() { return this.accountForm.get('location.zipcode'); }

  public OnSubmitAccount() {
    this.currUser.Email = this.email?.value;
    if (this.currUser.Organization) {
      this.currUser.FirstName = this.name?.value;
      this.currUser.LastName = "";
    } else {
      this.currUser.FirstName = this.name?.value.substr(0,this.name.value.indexOf(' '));
      this.currUser.LastName = this.name?.value.substr(this.name.value.indexOf(' ')+1);
    }
    
    if (this.addressTwo?.value == "") {
      this.currUser.Address = this.addressOne?.value;
    } else {
      this.currUser.Address = this.addressOne?.value.concat(", ").concat(this.addressTwo?.value);
    }
    this.currUser.City = this.city?.value;
    this.currUser.State = this.state?.value;
    this.currUser.Zipcode = this.zipcode?.value;
    
    if (this.changePass) {
      this.dataLoaded = false;
      this.usersService.UpdateUser(this.currUser).subscribe(
        data => {
        },
        error => {
          this.dataLoaded = true;
          this.OnExit();
          this.snackBar.open("We were unable to update the user information.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
          this.ReportError("edit-account method OnSubmitAccount() error");
        },
        () => this.usersService.UpdateUserPassword(this.oldPassword?.value,this.password1?.value,this.currUser.Id).subscribe(
          data => {
            this.dataLoaded = true;

            this.currUser.Token = data;
            this.currentUserService.SetCurrentUser(this.currUser);
            this.snackBar.open("Your password was changed successfully.", "Close", {duration: 2000,panelClass: ['snackbar-color']});

            this.accountDialogRef.close(this.currUser);
          },
          error => {
            this.dataLoaded = true;
            this.OnExit();
            this.snackBar.open("The entered Old Password is incorrect.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
            this.ReportError("edit-account method UpdateUserPassword() error");
          })
        );        
    } else {
      this.dataLoaded = false;
      this.usersService.UpdateUser(this.currUser).subscribe(
        data => {
          this.dataLoaded = true;

          this.currentUserService.SetCurrentUser(this.currUser);
          this.accountDialogRef.close(this.currUser);
        },
        error => {
          this.dataLoaded = true;
          this.ReportError("edit-account method UpdateUser() error (in else switch)");
          this.OnExit();
        });
    }
  }

  public OnExit() {
    this.accountDialogRef.close();
  }

  public ReportError(errorReport: string) {
    this.usersService.ReportIssue(errorReport,this.currUser.Email).subscribe(
      data => {
        this.dataLoaded = true;
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }
}
