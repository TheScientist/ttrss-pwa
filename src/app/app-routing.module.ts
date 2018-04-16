import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { SettingsGuard } from './settings-guard.service';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  { path: 'overview', canActivate: [SettingsGuard], component: OverviewComponent},
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'overview', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
