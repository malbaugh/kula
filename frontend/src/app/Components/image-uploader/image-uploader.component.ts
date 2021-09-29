import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public dataLoaded: boolean = false;

  constructor(
    public snackBar: MatSnackBar,
    public imageDialog: MatDialogRef<ImageUploaderComponent>,
    @Inject(MAT_DIALOG_DATA) public imageEvent:any,
  ) { }

  ngOnInit() {
    this.imageChangedEvent = this.imageEvent;
    this.dataLoaded = true;
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }
  
  public OnSave() {
    this.imageDialog.close(this.croppedImage);
  }

  public OnExit() {
    this.imageDialog.close();
  }

}
