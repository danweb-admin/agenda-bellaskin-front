import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { DashboardService, SeriesData } from '../../services';
import * as moment from 'moment';

@Component({
    selector: 'app-locacoes-chart',
    templateUrl: 'locacoes-chart.component.html',
    styleUrls: ['./locacoes-chart.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})

export class LocacoesChartComponent implements OnChanges {
    
    chartOptions: any;
    
    constructor(private dashboardService: DashboardService){}
    @Input() filters: any;
    
    ngOnChanges(changes: SimpleChanges): void {
        const startDate = this.filters.startDate
        const startDate_ = startDate.format('YYYY-MM-DD');

        const endDate = this.filters.endDate
        const endDate_ = endDate.format('YYYY-MM-DD');
        this.dashboardService.getCalendarByPeriod(startDate_,endDate_,this.filters.status).subscribe((data: SeriesData[]) => {
            this.setChartOptions(data);
        });
    }
    
    
    private setChartOptions(data: SeriesData[]) {
        
        const xAxisLabels = data[0]?.labels || [];
        const totalizadores = data.map(series => `${series.name}: ${series.values.reduce((acc, val) => acc + val, 0)}`).join(' | ');
        
        
        this.chartOptions = {
            title: {
                text: 'Gráfico de Locações por Período e Status',
                subtext: `Totalizadores - ${totalizadores}`, // Exibe o total no subtexto
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: xAxisLabels,
            },
            yAxis: {
                type: 'value',
            },
            series: data.map(series => ({
                name: series.name,
                type: 'bar', 
                data: series.values
            }))  
        };
    }
    
}
