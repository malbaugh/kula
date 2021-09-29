import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/Data/Information/DialogData';

@Component({
  selector: 'app-confirm-delete-form',
  templateUrl: './confirm-delete-form.component.html',
  styleUrls: ['./confirm-delete-form.component.scss']
})
export class ConfirmDeleteFormComponent implements OnInit {
  public dataLoaded: boolean = false;

  constructor(
    public confirmDialogRef: MatDialogRef<ConfirmDeleteFormComponent>,
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
