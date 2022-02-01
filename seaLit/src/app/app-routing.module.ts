import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDetailsComponent } from './components/list-details/list-details.component';
import { ListComponent } from './components/list/list.component';
import { EntityDetailsComponent } from './components/entity-detail/entity-details.component';
import { RecordDetailsComponent } from './components/record-details/record-details.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'list/:source', component: ListDetailsComponent },
  { path: 'list/:source/Table/:name', component: EntityDetailsComponent },
  { path: 'list/:source/:id/Table/:name', component: EntityDetailsComponent },
  { path: 'list/:source/:id', component: RecordDetailsComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
