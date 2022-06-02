import { NgModule } from '@angular/core';
import { BrowserModule, Title} from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MatMenuModule} from '@angular/material/menu';
import { MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { NgChartsModule } from 'ng2-charts';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ListComponent } from './components/list/list.component';
import { ListDetailsComponent } from './components/list-details/list-details.component';
import { EntityDetailsComponent } from './components/entity-detail/entity-details.component';
import { RecordDetailsComponent } from './components/record-details/record-details.component';
import { FooterComponent } from './components/footer/footer.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AboutComponent } from './components/about/about.component';
import { ExploreAllComponent } from './components/explore-all/explore-all.component';
import { ExploreAllDetailComponent } from './components/explore-all-detail/explore-all-detail.component';
import { TableComponent } from './components/table/table.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListComponent,
    ListDetailsComponent,
    EntityDetailsComponent,
    RecordDetailsComponent,
    FooterComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    AboutComponent,
    ExploreAllComponent,
    ExploreAllDetailComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    NgChartsModule,
    MatMenuModule,
    AgGridModule.withComponents([]),
    NoopAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
