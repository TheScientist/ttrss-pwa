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
  MatExpansionModule,
  MatTooltipModule,
  MatTabsModule,
  MatTreeModule,
  MatSlideToggleModule,
  MatProgressBarModule
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
    MatExpansionModule,
    MatTooltipModule,
    MatTabsModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatProgressBarModule
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
    MatExpansionModule,
    MatTooltipModule,
    MatTabsModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatProgressBarModule
  ]
})
export class MaterialModule {}
