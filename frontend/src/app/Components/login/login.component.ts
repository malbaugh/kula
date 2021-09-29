import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public dataLoaded = false;
  public invalidCred = false;
  public user: any;
  public returnUrl!: string;
  public loginForm!: FormGroup;
  public hide = true;
  
  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public loginDialogRef: MatDialogRef<LoginComponent>,
    public dialog: MatDialog,
    public currentUserService: CurrentUserService,
    public snackBar: MatSnackBar,
    public usersService: UsersService,
    private gtmService: GoogleTagManagerService,
  ) {
    //Option to redirect them to their home page if they are already logged in with cookies
  }
  
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.dataLoaded = true;
  }

  // Convenience getter for easy access to form fields
  public get form() { return this.loginForm.controls; }

  // Getters so we can get each control for error messages in form
  public get email() { return this.loginForm.get('email'); }
  public get password() { return this.loginForm.get('password'); }

  public OnSubmit() {
    this.currentUserService.RecordEvent("button-click","User logged in","registration").subscribe(data => {});
    this.invalidCred = false;
    this.dataLoaded = false;
    this.currentUserService.Login(this.email?.value, this.password?.value).subscribe(
      data => {
        this.dataLoaded = true;

        this.router.navigate(['/welcome']);
        this.OnExit();
      },
      error => {
        this.dataLoaded = true;
        this.snackBar.open("Incorrect email or password.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        this.ReportError("login method OnSubmit() error");
      });
  }

  public OnExit(): void {
    this.loginDialogRef.close();
  }

  public OnRegister(): void {
    this.currentUserService.RecordEvent("button-click","User navigated to start registering","registration").subscribe(data => {});
    
    this.loginDialogRef.close();
    this.router.navigate(['/registration']);
  }

  public ReportError(errorReport: string) {
    this.usersService.ReportIssue(errorReport,this.email?.value).subscribe(
      data => {
        this.dataLoaded = true;
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }
}
