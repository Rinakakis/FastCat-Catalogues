import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDetailsComponent } from './components/list-details/list-details.component';
import { ListComponent } from './components/list/list.component';
import { EntityDetailsComponent } from './components/entity-detail/entity-details.component';
import { RecordDetailsComponent } from './components/record-details/record-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'list/:source', component: ListDetailsComponent },
  { path: 'list/:source/Table/:name', component: EntityDetailsComponent },
  { path: 'list/:source/:id', component: RecordDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
