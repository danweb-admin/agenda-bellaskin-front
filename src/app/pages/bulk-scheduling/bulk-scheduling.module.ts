import { StickyNotesService } from './../../shared/services/sticky-notes.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule } from 'ngx-mask'
import { MatTabsModule } from '@angular/material/tabs';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { TextMaskModule } from 'angular2-text-mask';
import { BulkSchedulingPageComponent } from './containers/bulk-scheduling-page/bulk-scheduling-page.component';
import { BulkSchedulingRoutingModule } from './bulk-scheduling-routing.module';
import { BulkSchedulingTableComponent } from './components/bulk-scheduling-table/bulk-scheduling-table.component';

@NgModule({
  declarations: [
      BulkSchedulingPageComponent,
      BulkSchedulingTableComponent
  ],
  imports: [
    CommonModule,
    BulkSchedulingRoutingModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTabsModule,
    SharedModule,
    TextMaskModule,
    NgxMaskModule.forChild(),
  ],
  providers: [
    CalendarService,
    StickyNotesService
  ]
})
export class BulkSchedulingModule { }
