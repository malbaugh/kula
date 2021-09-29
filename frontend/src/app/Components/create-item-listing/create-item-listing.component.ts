import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { Item } from 'src/Helpers/Items/Classes/Item';
import { User } from 'src/Helpers/Users/Classes/User';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-create-item-listing',
  templateUrl: './create-item-listing.component.html',
  styleUrls: ['./create-item-listing.component.scss']
})
export class CreateItemListingComponent implements OnInit {
  public itemCreateForm!: FormGroup;
  public item!: Item;
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
    ) {}

  ngOnInit() {
    this.currUser = this.currentUserService.CurrentUserValue;

    this.itemCreateForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      instructions: ['', [Validators.required]]
    });

    this.currentUserService.RecordEvent("button-click","The item listing component opened","engagement").subscribe(data => {});

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public get form() { return this.itemCreateForm.controls }

  public get itemName() { return this.itemCreateForm.get('name'); }
  public get photo() { return this.itemCreateForm.get('photo'); }
  public get description() { return this.itemCreateForm.get('description'); }
  public get instructions() { return this.itemCreateForm.get('instructions'); }

  public OnSubmitItem(): void {
    if (this.image != null) {
      this.image = this.image.split(",")[1];
    }

    this.item = new Item(-1,this.itemName?.value,"",this.description?.value,this.currUser.Id,this.currUser.City,this.currUser.State,this.currUser.Zipcode,false,false,this.currUser.Organization,-1,new Date(),new Date());
    this.item.Instructions = this.instructions?.value;

    if (this.image == null) {
      this.snackBar.open("You need a photo of the item.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
      this.ReportError("create-item-listing method OnSubmitItem() error image is null");
    
    } else {
      this.currentUserService.RecordEvent("button-click","User submitted an item for donation","engagement").subscribe(data => {});
      
      this.dataLoaded = false;
      this.itemsService.CreateItem(this.item, this.image).subscribe(
        data => {
          this.dataLoaded = true;
          this.OnExit();
        },
        error => {
          this.dataLoaded = true;
          this.snackBar.open("Something went wrong.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
          this.ReportError("create-item-listing method OnSubmitItem() error");
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
