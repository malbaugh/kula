import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { take } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { RequestsService } from 'src/app/Services/Requests/requests.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ItemRequest } from 'src/Helpers/ItemRequests/Classes/ItemRequest';
import { User } from 'src/Helpers/Users/Classes/User';

@Component({
  selector: 'app-create-request-listing',
  templateUrl: './create-request-listing.component.html',
  styleUrls: ['./create-request-listing.component.scss']
})
export class CreateRequestListingComponent implements OnInit {
  public itemRequestForm!: FormGroup;
  public itemRequest!: ItemRequest;
  public ngZone!: NgZone;
  public dataLoaded: boolean = false;
  public limitUsers: boolean = false;
  public currUser!: User;
  public image: any = null;

  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    public requestsService: RequestsService,
    public route: ActivatedRoute,
    public router: Router,
    public usersService: UsersService,
    public itemRequestDialogForm: MatDialogRef<CreateRequestListingComponent>,
    public currentUserService: CurrentUserService,
    public snackBar: MatSnackBar,
    private gtmService: GoogleTagManagerService,
    ) {}

  ngOnInit() {
    this.currUser = this.currentUserService.CurrentUserValue;

    this.itemRequestForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    this.currentUserService.RecordEvent("button-click","The create request component opened","engagement").subscribe(data => {});

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public get form() { return this.itemRequestForm.controls }

  public get itemName() { return this.itemRequestForm.get('name'); }
  public get photo() { return this.itemRequestForm.get('photo'); }
  public get description() { return this.itemRequestForm.get('description'); }

  public OnSubmitItemRequest(): void {
    this.currentUserService.RecordEvent("button-click","User submitted an item request","engagement").subscribe(data => {});
    this.itemRequest = new ItemRequest(-1,this.itemName?.value,"",this.description?.value,this.currUser.Id,this.currUser.City,this.currUser.State,this.currUser.Zipcode,false,false,-1,new Date(),new Date());
    
    this.dataLoaded = false;
    this.requestsService.CreateRequest(this.itemRequest).subscribe(
      data => {
        this.dataLoaded = true;
        this.OnExit();
      },
      error => {
        this.dataLoaded = true;
        this.snackBar.open("Something went wrong.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        this.ReportError("create-request-listing method OnSubmitItemRequest() error");
        this.OnExit();
      }
    );
  }

  public OnExit() {
    this.itemRequestDialogForm.close();
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
