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
  MatDialogModule,
  MatExpansionPanel,
  MatExpansionModule
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
    MatDialogModule,
    MatExpansionModule
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
    MatDialogModule,
    MatExpansionModule
  ]
})
export class MaterialModule {}
