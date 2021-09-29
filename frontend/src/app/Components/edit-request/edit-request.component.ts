import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { take } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { RequestsService } from 'src/app/Services/Requests/requests.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ItemRequest } from 'src/Helpers/ItemRequests/Classes/ItemRequest';
import { User } from 'src/Helpers/Users/Classes/User';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss']
})
export class EditRequestComponent implements OnInit {
  public itemRequestForm!: FormGroup;
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
    public itemDialogForm: MatDialogRef<EditItemComponent>,
    public currentUserService: CurrentUserService,
    public snackBar: MatSnackBar,
    private gtmService: GoogleTagManagerService,
    @Inject(MAT_DIALOG_DATA) public itemRequest: ItemRequest
    ) {}

  ngOnInit() {
    this.currUser = this.currentUserService.CurrentUserValue;

    this.itemRequestForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    this.itemName?.setValue(this.itemRequest.Name);
    this.description?.setValue(this.itemRequest.Description);

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public get form() { return this.itemRequestForm.controls }

  public get itemName() { return this.itemRequestForm.get('name'); }
  public get description() { return this.itemRequestForm.get('description'); }

  public OnSubmitItem(): void {
    this.currentUserService.RecordEvent("button-click","User updated their request","engagement").subscribe(data => {});
    this.itemRequest.Name = this.itemName?.value;
    this.itemRequest.Description = this.description?.value;
    this.itemRequest.City = this.currUser.City;
    this.itemRequest.State = this.currUser.State;
    this.itemRequest.Zipcode = this.currUser.Zipcode;
    
    this.dataLoaded = false;
    this.requestsService.UpdateRequest(this.itemRequest).subscribe(
      data => {
        this.dataLoaded = true;
        this.OnExit();
      },
      error => {
        this.dataLoaded = true;
        this.snackBar.open("Something went wrong.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        this.ReportError("edit-itemRequest method OnSubmitItem() error");
        this.OnExit();
      }
    );
  }

  public OnSelectImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let imageDialog = this.dialog.open(ImageUploaderComponent, {
        data: event
      });

      imageDialog.afterClosed().subscribe(
        data => {
          this.image = data.base64;
        },
        error => {
          this.dataLoaded = true;
          this.ReportError("create-itemRequest-listing method OnSelectImage() error");
          this.OnExit();
        }
      );
    }
  }

  public Delete(){
    this.image = null;
  }

  public OnExit() {
    this.itemDialogForm.close();
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
