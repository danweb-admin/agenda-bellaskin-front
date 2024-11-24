import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { DashboardService } from '../../services';

@Component({
  selector: 'app-driver-chart',
  templateUrl: 'driver-chart.component.html',
  styleUrls: ['./driver-chart.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DriverChartComponent implements OnChanges {
  
  chartOptions: any = {};
  @Input() filters: any;

  constructor(private dashboardService: DashboardService){

  }
  
  ngOnChanges(changes: SimpleChanges): void {
    const startDate = this.filters.startDate
    const startDate_ = startDate.format('YYYY-MM-DD');
    
    const endDate = this.filters.endDate
    const endDate_ = endDate.format('YYYY-MM-DD');
    this.dashboardService.getDriverByPeriod(startDate_,endDate_,this.filters.status).subscribe((data: any[]) => {
      const seriesData = data.map(driver => ({
        value: driver.total,
        name: driver.name
      }));
      this.setChartOptions(seriesData);
    });
  }

    private setChartOptions(seriesData: any[]) {
      this.chartOptions = {
        title: {
          text: 'Locações por Motoristas',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/> {c} ({d}%)' // Exibe valor absoluto e percentual no tooltip
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Locações',
            type: 'pie',
            radius: ['40%', '70%'], // Configuração de rosca
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{c} ({d}%)' // Exibe nome, valor e percentual
            },
            labelLine: {
              show: true
            },
            data: seriesData
          }
        ]
      };
    }
  }
  