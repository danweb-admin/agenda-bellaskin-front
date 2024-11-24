import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { NgxEchartsModule } from 'ngx-echarts';
import { TrendModule } from 'ngx-trend';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';

import {
  VisitsChartComponent,
  PerformanceChartComponent,
  ServerChartComponent,
  RevenueChartComponent,
  DailyLineChartComponent,
  SupportRequestsComponent,
  ProjectStatChartComponent
} from './components';
import { SharedModule } from '../../shared/shared.module';
import { DashboardService } from './services';
import { EquipmentChartComponent } from './components/equipment-chart/equipment-chart.component';
import { DriverChartComponent } from './components/driver-chart/driver-chart.component';
import { FilterChartComponent } from './components/filter-chart/filter-chart.component';
import { DashboardPageComponent } from './containers/dashboard-page/dashboard-page.component';
import { LocacoesChartComponent } from './components/locacoes-chart/locacoes-chart.component';


@NgModule({
  declarations: [
    DashboardPageComponent,
    VisitsChartComponent,
    PerformanceChartComponent,
    ServerChartComponent,
    RevenueChartComponent,
    DailyLineChartComponent,
    SupportRequestsComponent,
    ProjectStatChartComponent,
    LocacoesChartComponent,
    EquipmentChartComponent,
    DriverChartComponent,
    FilterChartComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    NgxEchartsModule,
    TrendModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatGridListModule,
    MatSelectModule,
    MatInputModule,
    NgApexchartsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    DailyLineChartComponent
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
