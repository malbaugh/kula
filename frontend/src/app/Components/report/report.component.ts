import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { User } from 'src/Helpers/Users/Classes/User';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  public headerForm!: FormGroup;
  public user!: User;
  public dataLoaded: boolean = false;
  public ngZone!: NgZone;

  constructor(
    public reportRef: MatDialogRef<ReportComponent>,
    public fb: FormBuilder,
    public usersService: UsersService,
    public currentUserService: CurrentUserService,
  ) { }

  ngOnInit() {
    this.headerForm = this.fb.group({
      issue: ['',[Validators.required]]
    });

    this.user = <User>this.currentUserService.CurrentUserValue;

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public OnSubmit() {
    this.usersService.ReportIssue(this.headerForm?.get('issue')?.value,this.user.Email).subscribe(
      data => {
        this.dataLoaded = true;
        this.reportRef.close();
      },
      error => {
        this.dataLoaded = true;
        this.reportRef.close();
      }
    );
  }

  public OnExit() {
    this.reportRef.close();
  }
}
