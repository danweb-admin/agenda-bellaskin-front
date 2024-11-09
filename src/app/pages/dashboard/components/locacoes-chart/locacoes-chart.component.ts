import { Component, OnInit } from '@angular/core';
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

export class LocacoesChartComponent implements OnInit {
    
    status: string;
    form: FormGroup;
    chartOptions: any;
    
    constructor(private dashboardService: DashboardService, 
        private formBuilder: FormBuilder) {}
        
        ngOnInit(): void {
            
            const startDate_ = moment().startOf('month');
            const endDate_ = moment().endOf('month');
            const _status = ['1'];
            
            this.form = this.formBuilder.group({
                startDate: [startDate_, Validators.required],
                endDate: [endDate_, Validators.required],
                status: [_status, Validators.required],
            });
            
            
            this.gerarChart()
        }
        
        gerarChart(){
            const startDate = this.form.value.startDate.format('DD-MM-YYYY')
            const endDate = this.form.value.endDate.format('DD-MM-YYYY')
            
            this.dashboardService.getCalendarByPeriod(startDate,endDate,this.form.value.status).subscribe((data: SeriesData[]) => {
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
        
        onSubmit(){
            this.gerarChart();
            console.log(this.form);
        }
    }
    