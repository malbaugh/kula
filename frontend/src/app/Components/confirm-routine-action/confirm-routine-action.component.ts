import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/Data/Information/DialogData';

@Component({
  selector: 'app-confirm-routine-action',
  templateUrl: './confirm-routine-action.component.html',
  styleUrls: ['./confirm-routine-action.component.scss']
})
export class ConfirmRoutineActionComponent implements OnInit {

  public dataLoaded: boolean = false;

  constructor(
    public confirmDialogRef: MatDialogRef<ConfirmRoutineActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.dataLoaded = true;
  }

  public OnDelete() {
    this.confirmDialogRef.close(true);
  }

  public OnCancel() {
    this.confirmDialogRef.close(false);
  }

  public OnExit() {
    this.confirmDialogRef.close();
  }
}
