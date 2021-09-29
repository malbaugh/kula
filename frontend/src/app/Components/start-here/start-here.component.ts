import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { CreateItemListingComponent } from '../create-item-listing/create-item-listing.component';
import { CreateRequestListingComponent } from '../create-request-listing/create-request-listing.component';

@Component({
  selector: 'app-start-here',
  templateUrl: './start-here.component.html',
  styleUrls: ['./start-here.component.scss']
})
export class StartHereComponent implements OnInit {

  public actions!: any;
  public orgActions!: any;
  public dataLoaded: boolean = false;

  constructor(
    public currentUserService: CurrentUserService,
    public router: Router,
    public dialog: MatDialog,
    private gtmService: GoogleTagManagerService,
  ) {
    this.currentUserService.UserLocation = "";
   }

  ngOnInit(): void {
    this.actions = [
      {
        Id: "post-item",
        Icon: 'volunteer_activism',
        Title: "Donate an Item",
        Description: "Find a couple things you don't need anymore and donate them.",
        Link: ""
      },
      {
        Id: "make-request",
        Icon: 'emoji_people',
        Title: "Request an Item",
        Description: "Make a request for an item you need.",
        Link: ""
      },
      {
        Id: "share",
        Icon: 'thumb_up',
        Title: "Share",
        Description: "Help us get more people involved by sharing on Facebook.",
        Link: "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkula.com%2F&amp;src=sdkpreparse"
      },
      {
        Id: "see-available-items",
        Icon: 'inventory',
        Title: "See Available Items",
        Description: "Check out what other people have donated so far.",
        Link: ""
      },
    ];

    this.orgActions = [
      {
        Id: "post-item",
        Icon: 'volunteer_activism',
        Title: "Donate an Item",
        Description: "Find some items to donate them to engage with your community.",
        Link: ""
      },
      {
        Id: "share",
        Icon: 'thumb_up',
        Title: "Share",
        Description: "Help us get more people involved by sharing on Facebook.",
        Link: "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkula.com%2F&amp;src=sdkpreparse"
      },
      {
        Id: "see-available-items",
        Icon: 'inventory',
        Title: "See Available Items",
        Description: "Check out what other people have donated so far.",
        Link: ""
      },
    ];

    this.dataLoaded = true;
  }

  public OnSelectAction(action: any) {
    if (action.Id == "share") {
      this.currentUserService.RecordEvent("button-click","User shared Kula with their friends via facebook","engagement").subscribe(data => {});
  
      window.open(action.Link);
    } 
    else if (action.Id == "post-item") {
      const createItemDialog = this.dialog.open(CreateItemListingComponent);

      createItemDialog.afterClosed().subscribe(
        data => {
          this.router.navigate(['/my-items/',this.currentUserService.CurrentUserValue.Id]);
        }
      );
    }
    else if (action.Id == "make-request") {
      const makeRequestDialog = this.dialog.open(CreateRequestListingComponent);

      makeRequestDialog.afterClosed().subscribe(
        data => {
          this.router.navigate(['/my-requests/',this.currentUserService.CurrentUserValue.Id]);
        }
      );
    }
    else if (action.Id == "see-available-items") {
      this.currentUserService.RecordEvent("button-click","User clicked to see available items","engagement").subscribe(data => {});

      this.router.navigate(['/search']);
    }
  }

}
