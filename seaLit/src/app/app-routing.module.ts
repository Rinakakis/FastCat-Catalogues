import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDetailsComponent } from './components/list-details/list-details.component';
import { ListComponent } from './components/list/list.component';
import { EntityDetailsComponent } from './components/entity-detail/entity-details.component';
import { RecordDetailsComponent } from './components/record-details/record-details.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AboutComponent } from './components/about/about.component';
import { ExploreAllComponent } from './components/explore-all/explore-all.component';

const routes: Routes = [
  { path: '', redirectTo: '/sources', pathMatch: 'full' },
  { path: 'sources', component: ListComponent },
  { path: 'explore-all', component: ExploreAllComponent },
  { path: 'sources/:source', component: ListDetailsComponent },
  { path: 'sources/:source/table/:name', component: EntityDetailsComponent },
  { path: 'sources/:source/:id/table/:name', component: EntityDetailsComponent },
  { path: 'sources/:source/:id', component: RecordDetailsComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
