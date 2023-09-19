import { Calendar } from './../../../../shared/models/calendar';
import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { City } from 'src/app/shared/models/city';
import { Equipament } from 'src/app/shared/models/equipament';
import { EquipamentSpecifications } from 'src/app/shared/models/equipamentSpecifications';
import { Person } from 'src/app/shared/models/person';
import { Specification } from 'src/app/shared/models/specification';
import { State } from 'src/app/shared/models/state';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { EquipamentsService } from 'src/app/shared/services/equipaments.service';
import { EstadosCidadesServices } from 'src/app/shared/services/estados-cidades.service';
import { PersonService } from 'src/app/shared/services/people.service';
import { SpecificationsService } from 'src/app/shared/services/specifications.service';
import { Client } from '../../../../shared/models/client';
import { ClientsService } from '../../../../shared/services/clients.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { CDK_DESCRIBEDBY_HOST_ATTRIBUTE } from '@angular/cdk/a11y';

const moment = _rollupMoment || _moment;

@Component({
    selector: 'app-calendar-dialog',
    templateUrl: 'calendar-dialog.component.html',
    styleUrls: ['./calendar-dialog.component.scss'],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
  })
  export class CalendarDialogComponent implements AfterViewInit{
    
    form: FormGroup;
    isAddMode: boolean;
    id: string;
    arr: FormArray;
    clientResult: [];
    techniqueResult: Person[];
    driverResult: Person[];
    equipamentResult: Equipament[];
    specificationResult: Specification[];
    isLoading = false;
    isLoadingEquipament = false;
    notFound = false;
    todayDate;
    inputReadonly = true;
    semCadastro = false;
    @ViewChild('selectIcon') selectIcon;
    selectedtype: any;
    icons: any = [
      {
        id: "0",
        icon: ""
      },
      {
        id: "1",
        icon: "arrow_forward"
      },
      {
        id: "2",
        icon: "arrow_back"
      },
      {
        id: "3",
        icon: "swap_horiz"
      }
    ];

    constructor(
      public dialogRef: MatDialogRef<CalendarDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private calendarService: CalendarService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private clientService: ClientsService,
      private equipamentService: EquipamentsService,
      private personService: PersonService,
      private specificationService: SpecificationsService,
      private cdr: ChangeDetectorRef) {
        this.todayDate = new Date();
        this.readOnly();

    }

    readOnly(): void{
      const data = this.data.element?.date;
      if (data === undefined){
        this.inputReadonly = false;
        return;
      }
      let ret = this.compare(data.substring(0,10),this.formatDate(this.todayDate));
      
      if (ret >= 0)
        this.inputReadonly = false;
    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        this.ajustesCSS();
      },500);
    }

    noCadastre(): void{
      this.semCadastro = !this.semCadastro;
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

    ngOnInit(): void {
      this.getPeople();
      this.getEquipaments();
      this.getSpecifications();
      this.createForm();
      this.onChanges();
    }

    createForm(): void {
      let list = this.data.element?.calendarSpecifications;
      let temp = JSON.parse(localStorage.getItem('specificationsList'));
      let array = [];
      this.id = this.data.element;
      this.isAddMode = !this.id;

      if (!this.isAddMode){
        
        list.forEach(item => {
          let calendarSpecification = {
            
            active: (this.isAddMode ? false : this.data.element?.calendarSpecifications.filter(x => x.specificationId == item.specificationId)[0].active),
            specificationId: item.specificationId,
            name: temp.find(x => x.id === item.specificationId).name
          } as EquipamentSpecifications;
          array.push(this.buildCalendarSpecifications(calendarSpecification));
        });
      }
    
      this.form = this.formBuilder.group({
        id:  [this.data.element?.id || ''],
        createdAt: [this.data.element?.createdAt || new Date()],
        updatedAt: [this.data.element?.updatedsAt || null],
        client: this.inputReadonly ? [{value: this.data.element?.client, disabled: true }] : [this.data.element?.client,Validators.required],
        clientId: this.inputReadonly ? [{value: this.data.element?.clientId, disabled: true}] : [{value: this.data.element?.clientId, disabled: false}],
        driverId: this.inputReadonly ? [{value: this.data.element?.driverId, disabled: true}] : [{value: this.data.element?.driverId, disabled: false}],
        driverCollectsId: this.inputReadonly ? [{value: this.data.element?.driverCollectsId, disabled: true}] : [{value: this.data.element?.driverCollectsId, disabled: false}],
        techniqueId: this.inputReadonly ? [{value: this.data.element?.techniqueId, disabled: true}] : [{value: this.data.element?.techniqueId, disabled: false}],
        active: [true],
        noCadastre: this.inputReadonly ? [{value: this.data.element?.noCadastre || false, disabled: true}] : [{value: this.data.element?.noCadastre || false, disabled: false}],
        note: this.inputReadonly ? [{value: this.data.element?.note, disabled: true}] : [this.data.element?.note],
        userId: [this.data.element?.userId],
        parentId: [this.data.element?.parentId],
        travelOn: this.inputReadonly ? [{value: this.data.element?.travelOn || 0, disabled: true}] : [{value: this.data.element?.travelOn || 0, disabled: false}],
        date: this.inputReadonly ? [{value: this.data.element?.date || null,disabled: true},Validators.required] : [{value: this.data.element?.date || null, disabled: false},Validators.required],
        startTime1:this.inputReadonly ? [{value: this.data.element?.startTime.substring(11,16), disabled: true}] : [this.data.element?.startTime.substring(11,16) || null,Validators.required],
        endTime1: this.inputReadonly ? [{value: this.data.element?.endTime.substring(11,16), disabled: true}] : [this.data.element?.endTime.substring(11,16) || null,Validators.required],
        status: this.inputReadonly ? [{value: this.data.element?.status || '2', disabled: true}] : [{value: this.data.element?.status || '2', disabled: false}],
        equipamentId: this.inputReadonly ?  [{value: this.data.element?.equipamentId || null, disabled: true} ,Validators.required] : [{value: this.data.element?.equipamentId || null, disabled: false} ,Validators.required],
        temporaryName: this.inputReadonly ? [{value: this.data.element?.temporaryName, disabled: true}] : [{value: this.data.element?.temporaryName, disabled: false}],
        calendarSpecifications:  this.formBuilder.array(this.data.element?.calendarSpecifications ? array : [])
      });
      this.semCadastro = this.form.value.noCadastre;
      this.selectedtype = this.icons.find(x => x.id == this.form.value.travelOn).icon;
      
    } 

    buildCalendarSpecifications(equipamentSpecification: EquipamentSpecifications){
      return this.formBuilder.group({
        specificationId: equipamentSpecification.specificationId,
        active: equipamentSpecification.active,
        name: equipamentSpecification.name
      });
    }

    getPeople(): void {
      this.personService.loadPeople(true).subscribe((resp: Person[]) => {
        this.techniqueResult = resp.filter(x => x.personType === 'T');
        this.driverResult = resp.filter(x => x.personType === 'M');
      })
    }

    getEquipaments(): void{
      this.equipamentService.loadEquipaments(true).subscribe((resp: Equipament[]) => {
        this.equipamentResult = resp;
      })
    }

    onRoomChange(value){
      this.selectedtype = this.icons.find(x => x.id == value).icon;
    }

    getSpecifications(): void{
      this.specificationService.loadSpecifications().subscribe((resp: Specification[]) => {
        this.specificationResult = resp.filter(x => x.active === true);
      })
    }

    onChangeEquipament(event): void {
      this.arr = this.form.get('calendarSpecifications') as FormArray;
      let temp = this.equipamentResult.filter(x => x.id === event.value);

      if (this.arr.value.length !== 0)
        this.arr.clear();
    
      temp[0].equipamentSpecifications.forEach(item => {
        if (item.active){
          const spec = this.specificationResult.find(x => x.id === item.specificationId);
          const active = this.data.element?.equipamentSpecifications?.filter(x => x.specificationId == item.id)[0].active
          let equipamentSpecification = {
            active: (this.isAddMode ? false : active == null ? false : active ),
            specificationId: item.specificationId,
            name: spec.name
          } as EquipamentSpecifications;
          this.arr.push(this.buildCalendarSpecifications(equipamentSpecification));
        }
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    onSubmit(){
      if (this.form.value.id === ""){
        this.form.value.clientId = this.form.value.client.id;
        this.calendarService.save(this.form.value).subscribe((resp: Calendar) => {
          this.toastr.success('Locação criada com sucesso.');
          this.dialogRef.close(resp);
        },
        (error: any) =>{
          this.toastr.warning(error.error?.errorMessage)
        });
      } else {
        if (this.form.value.date < this.todayDate){
          this.toastr.warning("Essa locação não pode ser alterada.")
        }
        this.calendarService.update(this.form.value).subscribe((resp: Calendar) => {
          this.toastr.success('Locação atualizada com sucesso!');
          this.dialogRef.close(resp);
        },
        (error: any) =>{
          this.toastr.warning(error.error?.errorMessage)
        }
        );
      }
    }

    compare(dateTimeA, dateTimeB) {
      var data_locacao = moment(dateTimeA,"YYYY-MM-DD");
      var hoje = moment(dateTimeB,"YYYY-MM-DD");
      if (data_locacao > hoje) return 1;
      else if (data_locacao < hoje) return -1;
      else return 0;
    }

    padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    }

    formatDate(date) {
      return [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
        ,
      ].join('-');
    }

    ajustesCSS(){
      document.getElementsByClassName("mat-form-field-outline-thick")[0].setAttribute("style","width: 95%");
      var mat_select = document.getElementsByClassName('mat-select');
      for (var i = 0; i < mat_select.length; i++) {
        mat_select[i].setAttribute('style', 'display: contents');
      }
    }

    onBlur(input){
      var re=/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      
      var isValid = re.test(input.target.value);
      
      var element = document.getElementById(input.target.id) as HTMLInputElement;
      
      if(!isValid)
      {
        this.toastr.warning('Horário inválido');
        element.focus();
        element.value = ""
      }
    }
  }