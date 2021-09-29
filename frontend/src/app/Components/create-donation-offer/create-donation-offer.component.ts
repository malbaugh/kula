import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-create-donation-offer',
  templateUrl: './create-donation-offer.component.html',
  styleUrls: ['./create-donation-offer.component.scss']
})
export class CreateDonationOfferComponent implements OnInit {
  public itemClaimForm!: FormGroup;
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
    public itemDialogForm: MatDialogRef<CreateDonationOfferComponent>,
    public currentUserService: CurrentUserService,
    public snackBar: MatSnackBar,
    private gtmService: GoogleTagManagerService,
    @Inject(MAT_DIALOG_DATA) public itemRequest: ItemRequest
    ) {}

  ngOnInit() {
    this.currUser = this.currentUserService.CurrentUserValue;

    this.itemClaimForm = this.fb.group({
      description: ['', [Validators.required]]
    });

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public get form() { return this.itemClaimForm.controls }

  public get description() { return this.itemClaimForm.get('description'); }

  public OnSubmitDonation(): void {
    if (this.image != null) {
      this.image = this.image.split(",")[1];
    }

    if (this.image == null) {
      this.snackBar.open("You need a photo of the item.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
      this.ReportError("create-donation-offer method OnSubmitDonation() error image is null");
    
    } else {
      this.currentUserService.RecordEvent("button-click","User offered to donate an item for a request","engagement").subscribe(data => {});
    
      this.dataLoaded = false;
      this.requestsService.OfferDonation(this.itemRequest, this.description?.value, this.image).subscribe(
        data => {
          this.dataLoaded = true;
          this.snackBar.open("Thanks for donating! We will let the requester see the item you offered.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
          this.router.navigate(['/inbox']);
          this.OnExit();
        },
        error => {
          this.dataLoaded = true;
          this.snackBar.open("Something went wrong.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
          this.ReportError("create-itemRequest-claim method OnSubmitClaim() error");
          this.OnExit();
        }
      );
    }
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
          this.ReportError("create-item-listing method OnSelectImage() error");
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
