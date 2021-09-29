import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { $ } from 'protractor';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { MessagesService } from 'src/app/Services/Messages/messages.service';
import { RequestsService } from 'src/app/Services/Requests/requests.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { Conversation } from 'src/Helpers/Conversations/Classes/Conversation';
import { Message } from 'src/Helpers/Messages/Classes/Message';
import { User } from 'src/Helpers/Users/Classes/User';
import { ConfirmRoutineActionComponent } from '../confirm-routine-action/confirm-routine-action.component';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollframe') private myScrollContainer!: ElementRef;

  public msgStatuses = [{name: "All", state: true, class:"filter-chip"}, {name: "Unread", state: false, class:""}, {name: "Read", state: false, class:""}];
  public currMsgStatus: string = "";
  public conversationTypes = [{name: "All", state: true, class:"filter-chip"}, {name: "My Items", state: false, class:""}, {name: "My Requests", state: false, class:""}, {name: "Item Claims", state: false, class:""}, {name: "Donation Offers", state: false, class:""}];
  public currConvType: string = "";

  public disableMessages: boolean = true;

  public monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  public dataLoaded: boolean = false;
  public searchForm!: FormGroup;
  public messageForm!: FormGroup;
  public user!: User;
  public pageMsgs: Message[] = [];
  public selectedMsg!: Message;
  public selectedConversation!: Conversation;
  public pageConversations: Conversation[] = [];

  public loaded: boolean = false;
  public firstPageOpen: boolean = true;
  public msgRead!: any;

  public currMsgAboutItem: any = false;
  public currMsgDecisionMaker: any = false;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    public requestsService: RequestsService,
    public itemsService: ItemsService,
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public usersService: UsersService,
    public messagesService: MessagesService,
    public snackBar: MatSnackBar,
    public currentUserService: CurrentUserService
  ) 
  {
    this.currentUserService.UserLocation = "/search";
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.user = this.currentUserService.CurrentUserValue;

    this.searchForm = this.fb.group({
      search: ['']
    });

    this.messageForm = this.fb.group({
      newMessage: ['']
    });

    // if (this.currentUserService.UserSearch != "") {
    //   // Populates the lists initially
    //   this.ItemIterator(this.currentUserService.UserSearch);
    //   this.searchForm?.get('search')?.setValue(this.currentUserService.UserSearch);
    //   this.currentUserService.UserSearch = "";
    // } else {
    //   // Populates the lists initially
    this.MessageIterator();

    // }
  }

  public UnreadMessageCount() {
    this.messagesService.UnreadMessageCount().subscribe(
      data => {
        this.currentUserService.UnreadCount = data;
      }
    );
  }

  public Refresh() {
    this.currentUserService.RecordEvent("button-click","User refreshed their messages","communication").subscribe(data => {});
    this.UnreadMessageCount();
    this.MessageIterator(
      this.searchForm?.get('search')?.value,
      this.currMsgStatus
    );
  }

  public OnSearchSubmit() {
    
    this.currentUserService.RecordEvent("button-click","User searched through their messages","communication").subscribe(data => {});
    this.MessageIterator(
      this.searchForm?.get('search')?.value,
      this.currMsgStatus
    );
  }

  public triggerFunction(event: any) {
    if (event.shiftKey && event.key === 'Enter') {
      this.messageForm?.get('newMessage')?.setValue(this.messageForm?.get('newMessage')?.value + '\n');

    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.OnMessageSubmit();
    }
  }

  public OnMessageSubmit() {
    this.currentUserService.RecordEvent("conversion","User sent a message","communication").subscribe(data => {});
    var msgs: Message[] = this.selectedConversation.Messages;
    msgs.push(new Message(0,this.selectedConversation.Id,this.user.Id,this.messageForm?.get('newMessage')?.value,false,new Date(),new Date()));
    this.selectedConversation.Messages = msgs;
    this.scrollToBottom();
    var tempMsg = this.messageForm?.get('newMessage')?.value;
    this.messageForm?.get('newMessage')?.setValue(undefined);

    this.messagesService.SendMessage(this.selectedConversation,tempMsg).subscribe(
      data => {
        this.UnreadMessageCount();
        this.dataLoaded = true;
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }


  public DiscussionPurpose(conversation: Conversation) {
    if (conversation.Purpose == "Item" && this.user.Id != conversation.AuthUserId) {
      return "Discuss why you would like the item you claimed with that item's owner.";
    } else if (conversation.Purpose == "Item" && this.user.Id == conversation.AuthUserId) {
      return "Someone has claimed your item and would like to discuss why they need the item with you.";
    } else if (conversation.Purpose == "Request" && this.user.Id != conversation.AuthUserId) {
      return "Discuss the item donation offer you made with the individual who requested the item.";
    } else if (conversation.Purpose == "Request" && this.user.Id == conversation.AuthUserId) {
      return "Evaluate the offer made for your request and let them know if you would like the item.";
    } else {
      return "Discuss directly."
    }
  }

  public ApproveUserClaim() {
    const confirmDialogRef = this.dialog.open(ConfirmRoutineActionComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to donate the item to this individual? You will have an opportunity to reverse this decision in the future.',
        'confirm':'Yes',
        'cancel':'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.currentUserService.RecordEvent("button-click","User chose a claim to donate an item to.","engagement").subscribe(data => {});
          this.loaded = false;
          this.itemsService.SelectUserClaim(this.selectedConversation.ItemId, this.selectedConversation.Id).subscribe( // TODO: make this specific so we can send email to person who no longer has a claim.
            data => {
              this.selectedConversation.Complete = true;
              this.snackBar.open("Thanks for donating! We will let the individual know they can get the item. If you didn't include the pick up address for the item in the instructions, please do so now in the chat.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              this.OnSearchSubmit();
            }, 
            error => {
              this.dataLoaded = true;
              this.loaded = true;
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              this.ReportError("inbox method ApproveUserClaim() error");
            }
          );
        }
      }
    );
  }

  public AcceptDonation() {
    const confirmDialogRef = this.dialog.open(ConfirmRoutineActionComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to accept this donation? You will have an opportunity to reverse this decision in the future.',
        'confirm':'Yes',
        'cancel':'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        this.currentUserService.RecordEvent("button-click","User chose to accept a donation from another user","engagement").subscribe(data => {});
        if (data == true) {
          this.loaded = false;
          this.requestsService.SelectUserDonation(this.selectedConversation.ItemRequestId, this.selectedConversation.Id).subscribe( // TODO: make this specific so we can send email to person who no longer has a claim.
            data => {
              this.selectedConversation.Complete = true;
              this.snackBar.open("We will let the individual know they you want this item. Consider sending them a message asking for more details on picking up the item.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              this.OnSearchSubmit();
            }, 
            error => {
              this.dataLoaded = true;
              this.loaded = true;
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              this.ReportError("inbox method AcceptDonation() error");
            }
          );
        }
      }
    );
  }

  public GetMessageCreatedDate(msg: Message) {
    var m;
    var hourDay;
    if (msg.CreatedAt.getHours() >= 12) {
      hourDay = msg.CreatedAt.getHours() - 12;
      m = "PM";
    } else {
      hourDay = msg.CreatedAt.getHours();
      m = "AM";
    }
    if (hourDay == 0) {
      hourDay = 12;
    }

    return this.monthNames[msg.CreatedAt.getMonth()] + " " + msg.CreatedAt.getDate() + ", " + msg.CreatedAt.getFullYear() + ", " + hourDay + ":" + msg.CreatedAt.getMinutes() + " " + m;
  }

  public OnSelectConversation(conversation: Conversation) {
    this.messageForm?.get('newMessage')?.setValue(undefined);
    this.selectedConversation = conversation;
    if (conversation.ItemId != null && conversation.Messages[0].SenderId == this.user.Id) {
      this.currMsgAboutItem = true;
      this.currMsgDecisionMaker = false;
    } else if (conversation.ItemId != null && conversation.Messages[0].SenderId != this.user.Id) {
      this.currMsgAboutItem = true;
      this.currMsgDecisionMaker = true;
    } else if (conversation.ItemRequestId != null && conversation.Messages[0].SenderId == this.user.Id) {
      this.currMsgAboutItem = false;
      this.currMsgDecisionMaker = false;
    } else if (conversation.ItemRequestId != null && conversation.Messages[0].SenderId != this.user.Id) {
      this.currMsgAboutItem = false;
      this.currMsgDecisionMaker = true;
    }

    this.pageMsgs = conversation.Messages;
    if (!this.firstPageOpen) {
      this.currentUserService.RecordEvent("button-click","User selected a new conversation","communication").subscribe(data => {});
      if (!conversation.Read) {
        this.selectedConversation.Read = true;
        this.messagesService.MarkMessageRead(conversation.Messages[0]).subscribe(
          data => {
            this.dataLoaded = true;
            this.UnreadMessageCount();
          },
          error => {
            this.dataLoaded = true;
          }
        );
      }
    } else {
      this.firstPageOpen = false;
    }
  }

  public SelectReadFilter(event: MatChipSelectionChange, filterName: string) {
    var active = false;

    if (event.selected) {
      var selIndex = this.msgStatuses.findIndex((obj => obj.name == filterName));
      for (var i in this.msgStatuses) {
        if (+i != +selIndex) {
          this.msgStatuses[i].state = false;
          this.msgStatuses[i].class = "";
        }
        else {
          this.msgStatuses[i].state = true;
          this.msgStatuses[i].class = "filter-chip";
        }
      }
    } else {
      for (var i in this.msgStatuses) {
        if (this.msgStatuses[i].state) {
          filterName = this.msgStatuses[i].name;
          this.msgStatuses[i].class = "filter-chip";
        } else {
          this.msgStatuses[i].class = "";
        }
      }
    }

    for (var i in this.msgStatuses) {
      if (this.msgStatuses[i].state) {
        active = true;
      }
    }

    if (!active) {
      this.msgStatuses[0].state = true;
      this.msgStatuses[0].class = "filter-chip";
      filterName = this.msgStatuses[0].name;
    }

    this.currMsgStatus = filterName;

    this.MessageIterator(
      this.searchForm?.get('search')?.value,
      this.currMsgStatus
    );

    this.cd.detectChanges();
  }

  public MessageIterator(query?: string, read?: string) {
    this.loaded = false;
    this.UnreadMessageCount();

    if (read == "All") {
      this.msgRead = undefined;
    } else if (read == "Unread") {
      this.msgRead = false;
    } else if (read == "Read") {
      this.msgRead = true;
    } else if (read == undefined) {
      this.msgRead = undefined;
    }

    this.messagesService.SearchMessages(query).subscribe(
      data => {
        console.log(data)
        if (this.msgRead == undefined) {
          this.pageConversations = data;
        } else if (this.msgRead) {
          this.pageConversations = data.filter(function(e) {
            return e.Read == true;
          });
        } else {
          this.pageConversations = data.filter(function(e) {
            return e.Read == false;
          });
        }

        if (this.pageConversations.length > 0) {
          this.disableMessages = false;
          this.OnSelectConversation(this.pageConversations[0]);
        } else {
          this.disableMessages = true;
          this.selectedConversation = new Conversation(0,0,false,false,"","","","",false,new Date(), new Date());
          this.pageMsgs = [];
          this.currMsgDecisionMaker = false;
        }
        
        this.dataLoaded = true;
        this.loaded = true;
      }, 
      error => {
        this.ReportError("inbox method SearchMessages() error");
        this.dataLoaded = true;
        this.loaded = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
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
