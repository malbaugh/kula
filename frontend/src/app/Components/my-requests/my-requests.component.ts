import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { RequestsService } from 'src/app/Services/Requests/requests.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { STATES } from 'src/Data/Information/States';
import { ItemRequest } from 'src/Helpers/ItemRequests/Classes/ItemRequest';
import { User } from 'src/Helpers/Users/Classes/User';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';
import { ConfirmRoutineActionComponent } from '../confirm-routine-action/confirm-routine-action.component';
import { CreateRequestListingComponent } from '../create-request-listing/create-request-listing.component';
import { EditRequestComponent } from '../edit-request/edit-request.component';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent implements OnInit {
  // Search
  public searchForm!: FormGroup;
  public coveredStatuses = [{name: "All", state: true, class:"filter-chip"}, {name: "Donation Needed", state: false, class:""}, {name: "Getting Filled", state: false, class:""}, {name: "Filled", state: false, class:""}];
  public currRequestFilter: string = "";

  // Filters
  public filterForm!: FormGroup;
  public states = STATES;
  // Item Request Tab
  public allItemRequests: ItemRequest[] = [];
  public pageItemRequests: ItemRequest[] = [];
  public selectedItemRequest!: ItemRequest;
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
    public requestsService: RequestsService,
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
      this.RequestedItemIterator(this.currentUserService.UserSearch);
      this.searchForm?.get('search')?.setValue(this.currentUserService.UserSearch);
      this.currentUserService.UserSearch = "";
    } else {
      // Populates the lists initially
      this.RequestedItemIterator();
    }
  }

  public OnSearchSubmit() {
    this.RequestedItemIterator(
      this.searchForm?.get('search')?.value,
      this.filterForm?.get('postedDate')?.value,
      this.filterForm?.get('city')?.value,
      this.filterForm?.get('state')?.value,
      this.filterForm?.get('zipcode')?.value,
      this.currRequestFilter
    );
  }

  public SelectToolbarFilter(event: MatChipSelectionChange, filterName: string) {
    var active = false;

    if (event.selected) {
      var selIndex = this.coveredStatuses.findIndex((obj => obj.name == filterName));
      for (var i in this.coveredStatuses) {
        if (+i != +selIndex) {
          this.coveredStatuses[i].state = false;
          this.coveredStatuses[i].class = "";
        }
        else {
          this.coveredStatuses[i].state = true;
          this.coveredStatuses[i].class = "filter-chip";
        }
      }
    } else {
      for (var i in this.coveredStatuses) {
        if (this.coveredStatuses[i].state) {
          filterName = this.coveredStatuses[i].name;
          this.coveredStatuses[i].class = "filter-chip";
        } else {
          this.coveredStatuses[i].class = "";
        }
      }
    }

    for (var i in this.coveredStatuses) {
      if (this.coveredStatuses[i].state) {
        active = true;
      }
    }

    if (!active) {
      this.coveredStatuses[0].state = true;
      this.coveredStatuses[0].class = "filter-chip";
      filterName = this.coveredStatuses[0].name;
    }

    this.currRequestFilter = filterName;

    this.RequestedItemIterator(
      this.searchForm?.get('search')?.value,
      this.filterForm?.get('postedDate')?.value,
      this.filterForm?.get('city')?.value,
      this.filterForm?.get('state')?.value,
      this.filterForm?.get('zipcode')?.value,
      this.currRequestFilter
    );

    this.cd.detectChanges();
  }

  public OnSelect(itemRequest: any) {
    // this.router.navigate(["/itemRequest/",itemRequest.Id]);
  }

  public GetItemRequests(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.RequestedItemIterator();
  }

  public CheckCoveredStatus(itemRequest: ItemRequest) {
    if (itemRequest.CoveredStatus && itemRequest.FilledStatus) {
      return "Filled";
    } else if (itemRequest.CoveredStatus && !itemRequest.FilledStatus) {
      return "Getting Filled";
    } else {
      return "Donation Needed";
    }
  }

  public RequestedItemCovered(itemRequest: ItemRequest) {
    if (itemRequest.CoveredStatus) {
      return true;
    } else {
      return false;
    }
  }

  public RequestFilled(itemRequest: ItemRequest) {
    if (itemRequest.FilledStatus) {
      return true;
    } else {
      return false;
    }
  }

  public CreateItemRequest() {
    const accountDialogRef = this.dialog.open(CreateRequestListingComponent);

    accountDialogRef.afterClosed().subscribe(
      data => {
        this.RequestedItemIterator(
          this.searchForm?.get('search')?.value,
          this.filterForm?.get('postedDate')?.value,
          this.filterForm?.get('city')?.value,
          this.filterForm?.get('state')?.value,
          this.filterForm?.get('zipcode')?.value,
          this.currRequestFilter
        );
      }
    );
  }

  public RemoveItemRequest(itemRequest: ItemRequest) {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to delete this item request? You cannot undo this action.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.currentUserService.RecordEvent("button-click","User removed an item request","trouble").subscribe(data => {});
          this.dataLoaded = false;
          this.requestsService.DeleteRequest(itemRequest).subscribe(
            data => {
              this.RequestedItemIterator(
                this.searchForm?.get('search')?.value,
                this.filterForm?.get('postedDate')?.value,
                this.filterForm?.get('city')?.value,
                this.filterForm?.get('state')?.value,
                this.filterForm?.get('zipcode')?.value,
                this.currRequestFilter
              );
            }, 
            error => {
              this.dataLoaded = true;
              this.ReportError("my-items method RemoveItem() error");
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }
          );
        }
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }

  public MarkRequestFilled(itemRequest: ItemRequest) {
    const confirmDialogRef = this.dialog.open(ConfirmRoutineActionComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Do you have the item you requested? If you do not have the item, click Cancel. You cannot undo this action.',
        'confirm':'Yes',
        'cancel':'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.currentUserService.RecordEvent("button-click","User confirmed their request was filled","conversion").subscribe(data => {});
          this.dataLoaded = false;
          this.requestsService.MarkRequestFilled(itemRequest).subscribe(
            data => {
              this.RequestedItemIterator(
                this.searchForm?.get('search')?.value,
                this.filterForm?.get('postedDate')?.value,
                this.filterForm?.get('city')?.value,
                this.filterForm?.get('state')?.value,
                this.filterForm?.get('zipcode')?.value,
                this.currRequestFilter
              );
            }, 
            error => {
              this.dataLoaded = true;
              this.ReportError("my-requests method MarkItemTaken() error");
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }
          );
        }
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }

  public MakeItemRequestAvailable(itemRequest: ItemRequest) {
    const confirmDialogRef = this.dialog.open(ConfirmRoutineActionComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to make this item request visible again?',
        'confirm':'Yes',
        'cancel':'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.currentUserService.RecordEvent("button-click","User made a request available again","trouble").subscribe(data => {});
          itemRequest.CoveredStatus = false;

          this.requestsService.MakeRequestAvailableAgain(itemRequest).subscribe( // TODO: make this specific so we can send email to person who no longer has a claim.
            data => {
              this.dataLoaded = true;
              this.loaded = true;
            }, 
            error => {
              this.dataLoaded = true;
              this.loaded = true;
              this.ReportError("my-requests method MakeItemAvailable() error");
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }
          );
        }
      }
    );
  }

  public RequestedItemIterator(query?: string, datePosted?: Date, city?: string, state?: string, zipcode?: number, availability?:string) {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    var filled = undefined;
    var covered = undefined;

    if (availability == "All") {
      filled = undefined;
      covered = undefined;
    } else if (availability == "Donation Needed") {
      filled = false;
      covered = false;
    } else if (availability == "Getting Filled") {
      filled = false;
      covered = true;
    } else if (availability == "Filled") {
      filled = true;
      covered = true;
    } else if (availability == undefined || availability == "") {
      filled = false;
      covered = undefined;
    }

    this.loaded = false;
    this.requestsService.SearchRequests(query,filled,covered,this.user.Id,city,state,zipcode,datePosted).subscribe(
      data => {
        this.allItemRequests = data;
        const partialResults = data.slice(start,end);
        this.pageItemRequests = partialResults;
        this.dataLoaded = true;
        this.loaded = true;
      }, 
      error => {
        this.ReportError("my-requests method SearchRequests() error");
        this.dataLoaded = true;
        this.loaded = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public EditItemRequest(itemRequest: ItemRequest) {
    let editDialogRef = this.dialog.open(EditRequestComponent, {
      data: itemRequest
    });
  }

  public OnResetFilters() {
    this.filterForm.reset();
    this.OnSearchSubmit();
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
