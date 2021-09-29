import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { STATES } from 'src/Data/Information/States';
import { Item } from 'src/Helpers/Items/Classes/Item';
import { User } from 'src/Helpers/Users/Classes/User';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';
import { ConfirmRoutineActionComponent } from '../confirm-routine-action/confirm-routine-action.component';
import { CreateItemListingComponent } from '../create-item-listing/create-item-listing.component';
import { EditItemComponent } from '../edit-item/edit-item.component';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.scss']
})
export class MyItemsComponent implements OnInit {
  // Search
  public searchForm!: FormGroup;
  public claimedStatuses = [{name: "All", state: true, class:"filter-chip"}, {name: "Available", state: false, class:""}, {name: "Claimed", state: false, class:""}, {name: "Taken", state: false, class:""}];
  public currItemFilter: string = "";

  // Filters
  public filterForm!: FormGroup;
  public states = STATES;
  // Item Tab
  public allItems: Item[] = [];
  public pageItems: Item[] = [];
  public selectedItem!: Item;
  // Paginators
  public pageIndex: number = 0;
  public length: number = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Tabs
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  public dataLoaded: boolean = false;

  public loaded: boolean = false;

  public user!: User;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public usersService: UsersService,
    public itemsService: ItemsService,
    public snackBar: MatSnackBar,
    public currentUserService: CurrentUserService
  ) 
  {
    this.currentUserService.UserLocation = "/search";
  }

  ngOnInit() {
    this.user = this.currentUserService.CurrentUserValue;

    this.filterForm = this.fb.group({
      postedDate: [''],
      city: [''],
      state: [''],
      zipcode: [''],
      availability: ['']
    });

    this.searchForm = this.fb.group({
      search: ['']
    });

    if (this.currentUserService.UserSearch != "") {
      // Populates the lists initially
      this.ItemIterator(this.currentUserService.UserSearch);
      this.searchForm?.get('search')?.setValue(this.currentUserService.UserSearch);
      this.currentUserService.UserSearch = "";
    } else {
      // Populates the lists initially
      this.ItemIterator();
    }
  }

  public OnSearchSubmit() {
    this.ItemIterator(
      this.searchForm?.get('search')?.value,
      this.filterForm?.get('postedDate')?.value,
      this.filterForm?.get('city')?.value,
      this.filterForm?.get('state')?.value,
      this.filterForm?.get('zipcode')?.value,
      this.currItemFilter
    );
  }

  public OnSelect(item: any) {
    // this.router.navigate(["/item/",item.Id]);
  }

  public GetItems(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ItemIterator();
  }

  public CheckClaimedStatus(item: Item) {
    if (item.ClaimedStatus && item.TakenStatus) {
      return "Taken";
    } else if (item.ClaimedStatus && !item.TakenStatus) {
      return "Claimed";
    } else {
      return "Available";
    }
  }

  public ItemClaimed(item: Item) {
    if (item.ClaimedStatus) {
      return true;
    } else {
      return false;
    }
  }

  public ItemTaken(item: Item) {
    if (item.TakenStatus) {
      return true;
    } else {
      return false;
    }
  }

  public CreateItem() {
    const accountDialogRef = this.dialog.open(CreateItemListingComponent);

    accountDialogRef.afterClosed().subscribe(
      data => {
        this.ItemIterator(
          this.searchForm?.get('search')?.value,
          this.filterForm?.get('postedDate')?.value,
          this.filterForm?.get('city')?.value,
          this.filterForm?.get('state')?.value,
          this.filterForm?.get('zipcode')?.value,
          this.currItemFilter
        );
      }
    );
  }

  public RemoveItem(item: Item) {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to delete this item listing? You cannot undo this action.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.currentUserService.RecordEvent("button-click","User deleted an item listing","trouble").subscribe(data => {});
          this.dataLoaded = false;
          this.itemsService.DeleteItem(item).subscribe(
            data => {
              this.ItemIterator(
                this.searchForm?.get('search')?.value,
                this.filterForm?.get('postedDate')?.value,
                this.filterForm?.get('city')?.value,
                this.filterForm?.get('state')?.value,
                this.filterForm?.get('zipcode')?.value,
                this.currItemFilter
              );
            }, 
            error => {
              this.dataLoaded = true;
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              this.ReportError("my-items method RemoveItem() error");
            }
          );
        }
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }

  public SelectToolbarFilter(event: MatChipSelectionChange, filterName: string) {
    var active = false;

    if (event.selected) {
      var selIndex = this.claimedStatuses.findIndex((obj => obj.name == filterName));
      for (var i in this.claimedStatuses) {
        if (+i != +selIndex) {
          this.claimedStatuses[i].state = false;
          this.claimedStatuses[i].class = "";
        }
        else {
          this.claimedStatuses[i].state = true;
          this.claimedStatuses[i].class = "filter-chip";
        }
      }
    } else {
      for (var i in this.claimedStatuses) {
        if (this.claimedStatuses[i].state) {
          filterName = this.claimedStatuses[i].name;
          this.claimedStatuses[i].class = "filter-chip";
        } else {
          this.claimedStatuses[i].class = "";
        }
      }
    }

    for (var i in this.claimedStatuses) {
      if (this.claimedStatuses[i].state) {
        active = true;
      }
    }

    if (!active) {
      this.claimedStatuses[0].state = true;
      this.claimedStatuses[0].class = "filter-chip";
      filterName = this.claimedStatuses[0].name;
    }

    this.currItemFilter = filterName;

    this.ItemIterator(
      this.searchForm?.get('search')?.value,
      this.filterForm?.get('postedDate')?.value,
      this.filterForm?.get('city')?.value,
      this.filterForm?.get('state')?.value,
      this.filterForm?.get('zipcode')?.value,
      this.currItemFilter
    );

    this.cd.detectChanges();
  }

  public MarkItemTaken(item: Item) {
    const confirmDialogRef = this.dialog.open(ConfirmRoutineActionComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure this item was taken? You cannot undo this action.',
        'confirm':'Yes',
        'cancel':'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.currentUserService.RecordEvent("button-click","User confirmed an item was taken","conversion").subscribe(data => {});
          this.dataLoaded = false;
          this.itemsService.MarkItemTaken(item).subscribe(
            data => {
              this.ItemIterator(
                this.searchForm?.get('search')?.value,
                this.filterForm?.get('postedDate')?.value,
                this.filterForm?.get('city')?.value,
                this.filterForm?.get('state')?.value,
                this.filterForm?.get('zipcode')?.value,
                this.currItemFilter
              );
            }, 
            error => {
              this.dataLoaded = true;
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              this.ReportError("my-items method MarkItemTaken() error");
            }
          );
        }
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }

  public MakeItemAvailable(item: Item) {
    const confirmDialogRef = this.dialog.open(ConfirmRoutineActionComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to make this item available for others to claim?',
        'confirm':'Yes',
        'cancel':'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.currentUserService.RecordEvent("button-click","User made an item available again","trouble").subscribe(data => {});
          item.ClaimedStatus = false;

          this.itemsService.MakeItemAvailableAgain(item).subscribe( // TODO: make this specific so we can send email to person who no longer has a claim.
            data => {
              this.dataLoaded = true;
              this.loaded = true;
            }, 
            error => {
              this.dataLoaded = true;
              this.loaded = true;
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              this.ReportError("my-items method MakeItemAvailable() error");
            }
          );
        }
      }
    );
  }

  public ItemIterator(query?: string, datePosted?: Date, city?: string, state?: string, zipcode?: number, availability?:string) {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    var taken = undefined;
    var claimed = undefined;

    if (availability == "All") {
      taken = undefined;
      claimed = undefined;
    } else if (availability == "Available") {
      taken = false;
      claimed = false;
    } else if (availability == "Claimed") {
      taken = false;
      claimed = true;
    } else if (availability == "Taken") {
      taken = true;
      claimed = true;
    } else if (availability == undefined) {
      taken = false;
      claimed = undefined;
    }

    this.loaded = false;
    this.itemsService.SearchItems(query,taken,claimed,this.user.Id,city,state,zipcode,datePosted).subscribe(
      data => {
        this.allItems = data;
        const partialResults = data.slice(start,end);
        this.pageItems = partialResults;
        this.dataLoaded = true;
        this.loaded = true;
      }, 
      error => {
        this.ReportError("my-items method SearchItems() error");
        this.dataLoaded = true;
        this.loaded = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnResetFilters() {
    this.filterForm.reset();
    this.OnSearchSubmit();
  }

  public EditItem(item: Item) {
    let editDialogRef = this.dialog.open(EditItemComponent, {
      data: item
    });
  }
  

  public ReportError(errorReport: string) {
    this.usersService.ReportIssue(errorReport,this.user.Email).subscribe(
      data => {
        this.dataLoaded = true;
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }
}
