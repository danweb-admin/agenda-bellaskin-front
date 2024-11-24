import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { MY_FORMATS } from 'src/app/consts/my-format';

@Component({
    selector: 'app-filter-chart',
    templateUrl: './filter-chart.component.html',
    styleUrls: ['./filter-chart.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class FilterChartComponent implements OnInit {
    @Output() filterChanged = new EventEmitter<any>();
    
    filters = {
        status: null,
        startDate: null,
        endDate: null,
    };
    
    
    ngOnInit(): void {
        this.ajustesCSS();
        const startDate_ = moment().startOf('month');
        const endDate_ = moment().endOf('month');
        const _status = ['1','2'];

        this.filters.endDate = endDate_;
        this.filters.startDate = startDate_;
        this.filters.status = _status;

        this.filterChanged.emit(this.filters);
    }
    
    onFilterChange(): void {
        this.filterChanged.emit(this.filters);
    }
    
    ajustesCSS(){
        var mat_select = document.getElementsByClassName('mat-select');
        for (var i = 0; i < mat_select.length; i++) {
            mat_select[i].setAttribute('style', 'display: contents');
        }
    }
}

