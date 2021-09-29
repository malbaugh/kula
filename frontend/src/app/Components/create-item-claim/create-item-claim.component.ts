import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { take } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { Item } from 'src/Helpers/Items/Classes/Item';
import { User } from 'src/Helpers/Users/Classes/User';
import { CreateItemListingComponent } from '../create-item-listing/create-item-listing.component';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-create-item-claim',
  templateUrl: './create-item-claim.component.html',
  styleUrls: ['./create-item-claim.component.scss']
})
export class CreateItemClaimComponent implements OnInit {

  public itemClaimForm!: FormGroup;
  public ngZone!: NgZone;
  public dataLoaded: boolean = false;
  public limitUsers: boolean = false;
  public currUser!: User;
  public image: any = null;

  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    public itemsService: ItemsService,
    public route: ActivatedRoute,
    public router: Router,
    public usersService: UsersService,
    public itemDialogForm: MatDialogRef<CreateItemListingComponent>,
    public currentUserService: CurrentUserService,
    public snackBar: MatSnackBar,
    private gtmService: GoogleTagManagerService,
    @Inject(MAT_DIALOG_DATA) public item: Item
    ) {}

  ngOnInit() {
    this.currentUserService.RecordEvent("button-click","The item claim submission component opened","engagement").subscribe(data => {});
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

  public OnSubmitClaim(): void {
    this.currentUserService.RecordEvent("button-click","User submitted an item claim","engagement").subscribe(data => {});
    
    this.dataLoaded = false;
    this.itemsService.SubmitClaim(this.item, this.description?.value).subscribe(
      data => {
        this.dataLoaded = true;
        this.snackBar.open("We will notify the owner of the item that you would like it!", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        this.router.navigate(['/inbox']);
        this.OnExit();
      },
      error => {
        this.dataLoaded = true;
        this.snackBar.open("Something went wrong.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        this.ReportError("create-item-claim method OnSubmitClaim() error");
        this.OnExit();
      }
    );
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
