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
import { PersonService } from '../../shared/services/people.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MatTabsModule } from '@angular/material/tabs';
import { ModelConfigurationPageComponent } from './containers/model-configuration-page/model-configuration-page.component';
import { ModelConfigurationRoutingModule } from './model-configuration-routing.module';
import { ModelConfigurationTableComponent } from './components/model-configuration-table/model-configuration-table.component';
import { ModelConfigurationDialogComponent } from './components/model-configuration-dialog/model-configuration-dialog.component';

@NgModule({
  declarations: [
      ModelConfigurationPageComponent,
      ModelConfigurationTableComponent,
      ModelConfigurationDialogComponent
  ],
  imports: [
    CommonModule,
    ModelConfigurationRoutingModule,
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
    NgxMaskModule.forChild(),
  ],
  providers: [
    PersonService
  ]
})
export class ModelConfigurationModule { }
