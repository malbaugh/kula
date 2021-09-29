import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  public itemForm!: FormGroup;
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
    public itemDialogForm: MatDialogRef<EditItemComponent>,
    public currentUserService: CurrentUserService,
    public snackBar: MatSnackBar,
    private gtmService: GoogleTagManagerService,
    @Inject(MAT_DIALOG_DATA) public item: Item
    ) {}

  ngOnInit() {
    this.currUser = this.currentUserService.CurrentUserValue;

    this.itemForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      instructions: ['', [Validators.required]]
    });

    this.itemName?.setValue(this.item.Name);
    this.description?.setValue(this.item.Description);
    this.instructions?.setValue(this.item.Instructions);

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public get form() { return this.itemForm.controls }

  public get itemName() { return this.itemForm.get('name'); }
  public get description() { return this.itemForm.get('description'); }
  public get instructions() { return this.itemForm.get('instructions'); }

  public OnSubmitItem(): void {
    this.currentUserService.RecordEvent("button-click","User updated thier item listing","engagement").subscribe(data => {});
    this.item.Name = this.itemName?.value;
    this.item.Description = this.description?.value;
    this.item.Instructions = this.instructions?.value;
    this.item.City = this.currUser.City;
    this.item.State = this.currUser.State;
    this.item.Zipcode = this.currUser.Zipcode;
    
    this.dataLoaded = false;
    this.itemsService.UpdateItem(this.item).subscribe(
      data => {
        this.dataLoaded = true;
        this.OnExit();
      },
      error => {
        this.dataLoaded = true;
        this.snackBar.open("Something went wrong.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        this.ReportError("edit-item method OnSubmitItem() error");
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
