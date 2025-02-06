import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { ClientsService } from '../../../../shared/services/clients.service';
import { Client } from '../../../../shared/models/client';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { EquipamentsService } from 'src/app/shared/services/equipaments.service';
import { Equipament } from 'src/app/shared/models/equipament';
import { EquipamentSpecifications } from 'src/app/shared/models/equipamentSpecifications';
import { Specification } from 'src/app/shared/models/specification';
import { SpecificationsService } from 'src/app/shared/services/specifications.service';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/consts/my-format';
import moment from 'moment';
import { Person } from 'src/app/shared/models/person';
import { PersonService } from 'src/app/shared/services/people.service';
import { Retorno } from 'src/app/shared/models/retorno';


@Component({
  selector: 'app-bulk-scheduling-table',
  templateUrl: './bulk-scheduling-table.component.html',
  styleUrls: ['./bulk-scheduling-table.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class BulkSchedulingTableComponent implements AfterViewInit {
  public displayedColumns: string[] = ['nome', 'celular', 'telefone', 'cidade'];
  public dataSource: MatTableDataSource<Client> = new MatTableDataSource<Client>();
  public selection = new SelectionModel<Client>(true, []);
  public selectedTabIndex = 0;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('tabGroup') tabGroup;
  @ViewChild('inputSearch') inputSearch: ElementRef;
  isLoading = false;
  notFound = false;
  isValidated = false;
  form: FormGroup;
  clientResult: [];
  techniqueResult: Person[];
  equipmentResult: Equipament[];
  arr: FormArray;
  specificationResult: Specification[];
  todayDate;
  selectedDates: Date[] = [];
  dates: string[] = [];
  currentDate: Date | null = null;
  retornos: Retorno[] = [];
  
  
  
  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private clientService: ClientsService,
    private equipmentService: EquipamentsService,
    private specificationService: SpecificationsService,
    private calendarService: CalendarService,
    private personService: PersonService,
    private cdr: ChangeDetectorRef) {
      this.todayDate = new Date();
    }
    
    public ngOnInit(): void {
      this.createForm();
      this.getPeople();
      this.getEquipaments();
      this.getSpecifications();
      this.onChanges();
    }
    
    ngAfterViewInit(): void {
      setTimeout(() => {
        this.ajustesCSS();
      },500);
    }
    
    getPeople(): void {
      this.personService.loadPeople(true).subscribe((resp: Person[]) => {
        this.techniqueResult = resp.filter(x => x.personType === 'T');
      })
    }
    
    createForm() {
      this.form = this.formBuilder.group({
        clientId:  [],
        client: [],
        equipmentId: ['',Validators.required],
        startTime1: ['',Validators.required],
        endTime1: ['',Validators.required],
        date: [],
        note: [],
        currentDate: [],
        checkScheduling: [],
        techniqueId: [],
        calendarSpecifications:  this.formBuilder.array([]),
      });
    }
    
    onChangeEquipament(event): void {
      this.isValidated = false;
      this.arr = this.form.get('calendarSpecifications') as FormArray;
      let temp = this.equipmentResult.filter(x => x.id === event.value);
      
      if (this.arr.value.length !== 0)
      this.arr.clear();
      
      temp[0].equipamentSpecifications.forEach(item => {
        if (item.active){
          const spec = this.specificationResult.find(x => x.id === item.specificationId);
          let equipamentSpecification = {
            active: true,
            specificationId: item.specificationId,
            name: spec.name
          } as EquipamentSpecifications;
          this.arr.push(this.buildCalendarSpecifications(equipamentSpecification));
        }
      });
    }
    
    buildCalendarSpecifications(equipamentSpecification: EquipamentSpecifications){
      return this.formBuilder.group({
        specificationId: equipamentSpecification.specificationId,
        name: equipamentSpecification.name
      });
    }
    
    getEquipaments(): void{
      this.equipmentService.loadEquipaments(true).subscribe((resp: Equipament[]) => {
        this.equipmentResult = resp;
      })
    }
    
    getSpecifications(): void{
      this.specificationService.loadSpecifications().subscribe((resp: Specification[]) => {
        this.specificationResult = resp.filter(x => x.active === true);
      })
    }
    
    optionSelected(event){
      this.isValidated = false;
    }
    
    onChanges(){
      this.form.get('client').valueChanges.pipe(
        filter( data => {
          if (typeof data === 'string' || data instanceof String){
            if (data.trim().length <= 2){
              this.isLoading = true;
              this.notFound = false;
              this.clientResult = [];
            }
            return data.trim().length > 2
          }
        }),
        debounceTime(500),
        switchMap(  (search: string) => {
          return search ? this.clientService.getClients(true,search) : of([]);
        })
        ).subscribe(data =>{
          this.clientResult = data as [];
          if (this.clientResult.length == 0)
          this.notFound = true
          else
          this.isLoading = false;
        })
      }
      
      displayFn(item) {
        if (item === null)
        return;
        return item?.name;
      }
      
      saveScheduling() {
        this.bulkScheduling(false);
      }
      
      bulkScheduling(checkScheduling){
        this.retornos = [];
        this.dates = [];
        this.form.value.clientId = this.form.value.client.id;
        this.form.value.checkScheduling = checkScheduling;
        this.form.value.date = this.getDates();
        this.calendarService.bulkScheduling(this.form.value).subscribe((resp: any) => {
          this.retornos = resp;
          if (checkScheduling == false){
            this.toastr.success('As locações foram agendadas conforme as datas informadas.');
            this.isValidated = false;
          }else{
            this.toastr.info('As locações foram validadas, verifique o retorno!')
            const length = this.retornos.length;
            const exist = this.retornos.filter(obj => obj.status == "Ok");

            if (exist.length == length){
              this.isValidated = true;
            }else{
              this.isValidated = false;
            }
            
          }
          
          
        });
      }
      
      checkScheduling() {
        this.bulkScheduling(true);
      }
      
      getDates(){
        this.selectedDates.forEach(element => {
          let date = moment(element).format('DD/MM/YYYY'); 
          this.dates.push(date);
          
        });
        return this.dates.join(',');
      }
      
      ajustesCSS(){
        document.getElementsByClassName("mat-form-field-outline-thick")[0].setAttribute("style","width: 95%");
        var mat_select = document.getElementsByClassName('mat-select');
        for (var i = 0; i < mat_select.length; i++) {
          mat_select[i].setAttribute('style', 'display: contents');
        }
      }
      
      addDate(): void {
        this.isValidated = false;
        if (this.form.value.currentDate && !this.selectedDates.some(date => this.isSameDate(date, this.form.value.currentDate))) {
          this.selectedDates.push(this.form.value.currentDate);
          this.form.value.currentDate = null; // Reseta o campo de data
          this.form.value.date 
        }
      }
      
      removeDate(dateToRemove: Date): void {
        this.selectedDates = this.selectedDates.filter(
          date => !this.isSameDate(date, dateToRemove)
          );
        }
        
        isSameDate(date1: Date, date2: Date): boolean {
          return date1 && date2 && moment(date1).isSame(moment(date2), 'day');
        }
        
        onBlur(input){
          this.isValidated = false;
          var re=/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          
          var isValid = re.test(input.target.value);
          
          var element = document.getElementById(input.target.id) as HTMLInputElement;
          
          if(!isValid)
          {
            this.toastr.warning('Horário inválido');
            element.focus();
            element.value = ""
            return false;
          }
          return true;
        }
        
        
      }