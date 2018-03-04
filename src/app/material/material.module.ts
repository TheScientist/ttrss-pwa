import { NgModule } from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';
import {
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatChipsModule,
  MatOptionModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  imports: [
    CdkTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  exports: [
    CdkTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule
  ]
})
export class MaterialModule {}
