import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { map } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { MessagesService } from 'src/app/Services/Messages/messages.service';
import { User } from 'src/Helpers/Users/Classes/User';
import { CreateItemListingComponent } from '../create-item-listing/create-item-listing.component';
import { CreateRequestListingComponent } from '../create-request-listing/create-request-listing.component';
import { EditAccountComponent } from '../edit-account/edit-account.component';
import { LoginComponent } from '../login/login.component';
import { ReportComponent } from '../report/report.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public searchForm!: FormGroup;
  public user!: User;
  public userLocation: string = "";
  
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public currentUserService: CurrentUserService,
    public messagesService: MessagesService,
    public fb: FormBuilder,
    public http: HttpClient) {
  }

  ngOnInit() {
    this.UnreadMessageCount();
    this.userLocation = this.currentUserService.UserLocation;
    this.searchForm = this.fb.group({search: ['']});
  }

  public UnreadMessageCount() {
    this.messagesService.UnreadMessageCount().subscribe(
      data => {
        this.currentUserService.UnreadCount = data;
      }
    );
  }
  
  public OnSearchSubmit() {
    this.currentUserService.RecordEvent("button-click","User clicked to submit a search","engagement").subscribe(data => {});
    this.currentUserService.UserSearch = this.searchForm?.get('search')?.value;
    this.searchForm.reset();
    this.router.navigate(['/search']);
  }

  public OnUserHome() {
    this.currentUserService.RecordEvent("button-click","User clicked the home button","navigation").subscribe(data => {});
    this.router.navigate(['/welcome']);
  }
  public OnUserItems() {
    this.currentUserService.RecordEvent("button-click","User clicked to navigate to their items","navigation").subscribe(data => {});
    this.router.navigate(['/my-items/',this.currentUserService.CurrentUserValue.Id]);
  }
  public OnUserRequests() {
    this.currentUserService.RecordEvent("button-click","User clicked to navigate to their requests","navigation").subscribe(data => {});
    this.router.navigate(['/my-requests/',this.currentUserService.CurrentUserValue.Id]);
  }
  public OnAccountSettings() {
    this.currentUserService.RecordEvent("button-click","User clicked to edit their account information","profile").subscribe(data => {});
    this.user = this.currentUserService.CurrentUserValue;
    const accountDialogRef = this.dialog.open(EditAccountComponent, {
      data: this.user
    });
  }
  public OnLogout() {
    this.currentUserService.RecordEvent("button-click","User clicked button to log out","registration").subscribe(data => {});
    this.currentUserService.Logout();
    this.router.navigate(['/']);
  }

  public OnLogin() {
    this.currentUserService.RecordEvent("button-click","User clicked button to start log in process","registration").subscribe(data => {});
    let loginDialogRef = this.dialog.open(LoginComponent);
  }
  public OnRegister() {
    this.currentUserService.RecordEvent("button-click","User clicked the register button","registration").subscribe(data => {});
    this.router.navigate(['/registration']);
  }
  public OnHome() {
    this.currentUserService.RecordEvent("button-click","User clicked the home button","navigation").subscribe(data => {});
    this.router.navigate(['/']);
  }
  public OnReport() {
    this.currentUserService.RecordEvent("button-click","User clicked to report a problem","trouble").subscribe(data => {});
    let reportRef = this.dialog.open(ReportComponent);
  }

  public OnListItem() {
    this.currentUserService.RecordEvent("button-click","User clicked to list an item to donate","engagement").subscribe(data => {});
    const creatItemDialogRef = this.dialog.open(CreateItemListingComponent);

    creatItemDialogRef.afterClosed().subscribe(
      data => {
        this.router.navigate(['/my-items/',this.currentUserService.CurrentUserValue.Id]);
      }
    );
  }
  public OnMakeRequest() {
    this.currentUserService.RecordEvent("button-click","User clicked to start a item request","engagement").subscribe(data => {});
    const creatRequestDialogRef = this.dialog.open(CreateRequestListingComponent);

    creatRequestDialogRef.afterClosed().subscribe(
      data => {
        this.router.navigate(['/my-requests/',this.currentUserService.CurrentUserValue.Id]);
      }
    );
  }

  public OpenInbox() {
    this.currentUserService.RecordEvent("button-click","User opened their inbox","communication").subscribe(data => {});
    this.router.navigate(['/inbox']);
  }
}
