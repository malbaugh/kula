import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent, MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { RequestsService } from 'src/app/Services/Requests/requests.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { STATES } from 'src/Data/Information/States';
import { ItemRequest } from 'src/Helpers/ItemRequests/Classes/ItemRequest';
import { Item } from 'src/Helpers/Items/Classes/Item';
import { IItem } from 'src/Helpers/Items/Interfaces/IItem';
import { User } from 'src/Helpers/Users/Classes/User';
import { CreateDonationOfferComponent } from '../create-donation-offer/create-donation-offer.component';
import { CreateItemClaimComponent } from '../create-item-claim/create-item-claim.component';
import { SelectedTab } from './SelectedTab';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  // Search
  public currItemFilter: string = "";
  public currRequestFilter: string = "";
  public searchForm!: FormGroup;
  public selectable = true;
  public claimedStatuses = [{name: "All", state: false, class:""}, {name: "Available", state: true, class:"filter-chip"}, {name: "Claimed", state: false, class:""}, {name: "Taken", state: false, class:""}];
  public coveredStatuses = [{name: "All", state: false, class:""}, {name: "Donation Needed", state: true, class:"filter-chip"}, {name: "Getting Filled", state: false, class:""}, {name: "Filled", state: false, class:""}];

  public currentTabIndex: SelectedTab = 0;

  // Filters
  public filterForm!: FormGroup;
  public states = STATES;
  // Item Tab
  public allItems: Item[] = [];
  public pageItems: Item[] = [];
  public selectedItem!: Item;
  // Item Request Tab
  public allItemRequests: ItemRequest[] = [];
  public pageItemRequests: ItemRequest[] = [];
  public selectedItemRequest!: ItemRequest;
  // Paginators
  public pageIndex1: number = 0;
  public pageIndex2: number = 0;
  public length: number = 0;
  public pageSize1 = 10;
  public pageSize2 = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage1 = 0;
  public currentPage2 = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Tabs
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @ViewChild('drawer') sidenav!: MatSidenav;
  @Output() selectionChange: EventEmitter<MatChipSelectionChange> = new EventEmitter();

  public dataLoaded1: boolean = false;
  public dataLoaded2: boolean = false;

  public loaded1: boolean = false;
  public loaded2: boolean = false;

  public user!: User;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public usersService: UsersService,
    public itemsService: ItemsService,
    public snackBar: MatSnackBar,
    public currentUserService: CurrentUserService,
    public requestsService: RequestsService,
    private gtmService: GoogleTagManagerService,
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
      availability1: [''],
      availability2: ['']
    });

    this.searchForm = this.fb.group({
      search: ['']
    });

    if (this.user) {
      this.filterForm?.get('state')?.setValue(this.user.State);
    }

    if (this.currentUserService.UserSearch != "") {
      // Populates the lists initially
      this.ItemIterator(this.currentUserService.UserSearch);
      this.RequestedItemIterator(this.currentUserService.UserSearch);
      this.searchForm?.get('search')?.setValue(this.currentUserService.UserSearch);
      this.currentUserService.UserSearch = "";
    } else {
      // Populates the lists initially
      this.ItemIterator();
      this.RequestedItemIterator();
    }
  }

  public OnSearchSubmit() {
    if (this.currentTabIndex == 0) {
      this.currentUserService.RecordEvent("button-click","User submitted a search for an item","engagement").subscribe(data => {});
    
      this.ItemIterator(
        this.searchForm?.get('search')?.value,
        this.filterForm?.get('postedDate')?.value,
        this.filterForm?.get('city')?.value,
        this.filterForm?.get('state')?.value,
        this.filterForm?.get('zipcode')?.value,
        this.currItemFilter
      );
    }
    else if (this.currentTabIndex == 1) {
      this.currentUserService.RecordEvent("button-click","User submitted a search for a request","engagement").subscribe(data => {});
    
      this.RequestedItemIterator(
        this.searchForm?.get('search')?.value,
        this.filterForm?.get('postedDate')?.value,
        this.filterForm?.get('city')?.value,
        this.filterForm?.get('state')?.value,
        this.filterForm?.get('zipcode')?.value,
        this.currRequestFilter
      );
    }
  }

  public TabChanged(event: any) {
    this.currentTabIndex = event.index;
    this.OnSearchSubmit();
  }

  public OnSelect(item: any) {
    // this.router.navigate(["/item/",item.Id]);
  }

  public GetItems(event: any) {
    this.currentPage1 = event.pageIndex;
    this.pageSize1 = event.pageSize;
    this.ItemIterator();
  }

  public GetItemRequests(event: any) {
    this.currentPage2 = event.pageIndex;
    this.pageSize2 = event.pageSize;
    this.RequestedItemIterator();
  }

  public SelectToolbarFilter(event: MatChipSelectionChange, filterName: string) {
    var active = false;

    if (this.currentTabIndex == 0) {
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
        this.claimedStatuses[1].state = true;
        this.claimedStatuses[1].class = "filter-chip";
        filterName = this.claimedStatuses[1].name;
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

    else if (this.currentTabIndex == 1) {
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
        this.coveredStatuses[1].state = true;
        this.coveredStatuses[1].class = "filter-chip";
        filterName = this.coveredStatuses[1].name;
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
    this.cd.detectChanges();
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

  public CheckCoveredStatus(itemRequest: ItemRequest) {
    if (itemRequest.CoveredStatus && itemRequest.FilledStatus) {
      return "Filled";
    } else if (itemRequest.CoveredStatus && !itemRequest.FilledStatus) {
      return "Getting Filled";
    } else {
      return "Donation Needed";
    }
  }

  public CheckClaimedStatus(item: Item) {
    if (item.ClaimedStatus && item.TakenStatus) {
      return "Taken";
    } else if (item.ClaimedStatus && !item.TakenStatus) {
      return "Claimed";
    }
    else {
      return "Available";
    }
  }

  public CheckClaimable(item: Item) {
    if (item.ClaimedStatus && item.TakenStatus || this.user.Organization) {
      return false;
    } else if (item.ClaimedStatus && !item.TakenStatus || this.user.Organization) {
      return false;
    } else {
      return true;
    }
  }

  public ActivateFilter() {
    this.currentUserService.RecordEvent("button-click","User activated a search filter","engagement").subscribe(data => {});
  }

  public ClaimItem(item: Item) {
    if (this.user) {
      let editDialogRef = this.dialog.open(CreateItemClaimComponent, {
        data: item
      });
    } else {
      this.snackBar.open("You need to create an account to claim an item!", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      this.router.navigate(["/registration"]);
    }
    
  }

  public ItemIterator(query?: string, datePosted?: Date, city?: string, state?: string, zipcode?: number, availability?:string) {
    if (!query) {
      query = undefined;
    }
    if (!datePosted) {
      datePosted = undefined;
    }
    if (!city) {
      city = undefined;
    }
    if (!state) {
      state = undefined;
    }
    if (!zipcode) {
      zipcode = undefined;
    }

    const end1 = (this.currentPage1 + 1) * this.pageSize1;
    const start1 = this.currentPage1 * this.pageSize1;
    var taken = undefined;
    var claimed = undefined;

    // if (city == undefined && state == undefined && zipcode == undefined) {
    //   state = this.user.State;
    // }

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
    } else if (availability == undefined || availability == "") {
      taken = false;
      claimed = false;
    }

    this.loaded1 = false;
    this.itemsService.SearchItems(query,taken,claimed,undefined,city,state,zipcode,datePosted).subscribe(
      data => {
        this.allItems = data;
        const partialResults = data.slice(start1,end1);
        this.pageItems = partialResults;
        this.dataLoaded1 = true;
        this.loaded1 = true;
      }, 
      error => {
        this.dataLoaded1 = true;
        this.loaded1 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
        if (this.user != null) {
          this.ReportError("search method ItemIterator() error");
        } else {
          this.ReportError("search method ItemIterator() error");
        }
      });
  }

  public RequestedItemIterator(query?: string, datePosted?: Date, city?: string, state?: string, zipcode?: number, availability?:string) {
    if (!query) {
      query = undefined;
    }
    if (!datePosted) {
      datePosted = undefined;
    }
    if (!city) {
      city = undefined;
    }
    if (!state) {
      state = undefined;
    }
    if (!zipcode) {
      zipcode = undefined;
    }
    
    const end2 = (this.currentPage2 + 1) * this.pageSize2;
    const start2 = this.currentPage2 * this.pageSize2;
    var filled = undefined;
    var covered = undefined;

    // if (city == undefined && state == undefined && zipcode == undefined) {
    //   state = this.user.State;
    // }

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
      covered = false;
    }

    this.loaded2 = false;
    this.requestsService.SearchRequests(query,filled,covered,undefined,city,state,zipcode,datePosted).subscribe(
      data => {
        this.allItemRequests = data;
        const partialResults = data.slice(start2,end2);
        this.pageItemRequests = partialResults;
        this.dataLoaded2 = true;
        this.loaded2 = true;
      }, 
      error => {
        if (this.user != null) {
          this.ReportError("search method RequestItemIterator() error");
        } else {
          this.ReportError("search method RequestItemIterator() error");
        }
        this.dataLoaded2 = true;
        this.loaded2 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnResetFilters() {
    this.filterForm.reset();
    this.OnSearchSubmit();
  }

  public OnDonate(requestedItem: ItemRequest) {
    if (this.user) {
      this.currentUserService.RecordEvent("button-click","User clicked to donate an item","engagement").subscribe(data => {});

      let editDialogRef = this.dialog.open(CreateDonationOfferComponent, {
        data: requestedItem
      });
    } else {
      this.snackBar.open("You need to create an account to donate an item!", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      this.router.navigate(["/registration"]);
    }
  }

  public ReportError(errorReport: string) {
    this.usersService.ReportIssue(errorReport,this.user.Email).subscribe(
      data => {
        this.dataLoaded1 = true;
        this.dataLoaded2 = true;
      },
      error => {
        this.dataLoaded1 = true;
        this.dataLoaded2 = true;
      }
    );
  }
}
