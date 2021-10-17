import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDetailComponent } from './components/list-detail/list-detail.component';
import { ListComponent } from './components/list/list.component';
import { EntityDetailComponent } from './components/entity-detail/entity-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'list/:title', component: ListDetailComponent },
  { path: 'list/:entity/:name', component: EntityDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
