import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public userService: UsersService,
    public currentUserService: CurrentUserService
  ) { 
    this.currentUserService.UserLocation = "";
  }

  ngOnInit() {
    if (this.currentUserService.CurrentUserValue) { 
      this.router.navigate(['/welcome']);
    }
  }

  public OnLogin() {
    let loginDialogRef = this.dialog.open(LoginComponent);
  }

  public OnRegister() {
    this.router.navigate(['/registration']);
  }

  public OnSubmit() {
    this.router.navigate(['/search']);
  }
}
