import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ttrss-markreaddialog',
  templateUrl: './markreaddialog.component.html',
  styleUrls: ['./markreaddialog.component.css']
})
export class MarkreaddialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MarkreaddialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

}
