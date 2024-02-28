import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { City } from 'src/app/shared/models/city';
import { State } from 'src/app/shared/models/state';
import { EstadosCidadesServices } from 'src/app/shared/services/estados-cidades.service';
import { Client } from '../../../../shared/models/client';
import { ClientsService } from '../../../../shared/services/clients.service';

@Component({
    selector: 'app-clients-dialog',
    templateUrl: 'clients-dialog.component.html',
    styleUrls: ['./clients-dialog.component.scss']
  })
  export class ClientsDialogComponent implements OnInit, AfterViewInit {
    form: FormGroup;
    isAddMode: boolean;
    id: string;
    isPhysicalPerson: boolean;
    estados: State[];
    arrayEstados: State[];
    cidades: City[];
    arrayCidades: City[];
    @ViewChild('estado') selectEstado: MatSelect;
    @ViewChild('cidade') selectCidade: MatSelect;
    @ViewChild('stateInputSearch') stateInputSearch: any;
    @ViewChild('cityInputSearch') cityInputSearch: any;

    constructor(
      public dialogRef: MatDialogRef<ClientsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private clientService: ClientsService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private estadosCidadesService: EstadosCidadesServices) {
    }

    ngAfterViewInit(): void {
      if (this.data.element?.cityId != null){
        setTimeout(() => {
          this.selectEstado.options.filter(item => item.value == this.data.element?.stateId)[0].select();
        },500);
      }
      this.ajustesCSS();
    }

    ngOnInit(): void {
      this.getEstados();
      this.id = this.data.element;
      this.isAddMode = !this.id;
      this.form = this.formBuilder.group({
        id:  [this.data.element?.id || ''],
        name: [this.data.element?.name || '', Validators.required],
        responsible: [this.data.element?.responsible || ''],
        specialty: [this.data.element?.specialty || ''],
        clinicName: [this.data.element?.clinicName || ''],
        landMark: [this.data.element?.landMark || ''],
        zipCode: [this.data.element?.zipCode || ''],
        neighborhood: [this.data.element?.neighborhood || ''],
        cellPhone: [this.data.element?.cellPhone || ''],
        clinicCellPhone: [this.data.element?.clinicCellPhone || ''],
        phone: [this.data.element?.phone || ''],
        active: [this.data.element?.active || true, Validators.required],
        createdAt: [this.data.element?.createdAt || new Date()],
        updatedAt: [this.data.element?.updatedsAt || null],
        email: [this.data.element?.email || null],
        address: [this.data.element?.address || '', Validators.required],
        number: [this.data.element?.number || '', Validators.required],
        cnpj: [this.data.element?.cnpj || ''],
        ie: [this.data.element?.ie || ''],
        cpf: [this.data.element?.cpf || ''],
        rg: [this.data.element?.rg || ''],
        discount: [this.data.element?.discount || 0],
        freight: [this.data.element?.freight || 0],
        secretary: [this.data.element?.secretary || ''],
        complement: [this.data.element?.complement || ''],
        cityId: [this.data.element?.cityId || '', Validators.required],
        stateId: [this.data.element?.stateId || '', Validators.required],
        isAnnualContract: [this.data.element?.isAnnualContract],
        isReceipt: [this.data.element?.isReceipt],
        hasAirConditioning: [this.data.element?.hasAirConditioning],
        nameForReceipt: [this.data.element?.nameForReceipt || ''],
        takeTransformer: [this.data.element?.takeTransformer],
        has220V: [this.data.element?.has220V],
        hasStairs: [this.data.element?.hasStairs],
        hasElevator: [this.data.element?.hasElevator],
        hasTechnique: [this.data.element?.hasTechnique],
        techniqueOption1: [this.data.element?.techniqueOption1 || ''],
        techniqueOption2: [this.data.element?.techniqueOption2 || ''],
        equipamentValues: [this.data.element?.equipamentValues || '']
      });
      this.isPhysicalPerson = this.data.element? this.data.element.isPhysicalPerson : false;
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    getEstados(){
      this.estadosCidadesService.getEstados().subscribe((resp: State[]) => {
        this.estados = resp;
        this.arrayEstados = resp;
      });
    }

    onlyNumbers(event){
      let charCode = (event.which) ? event.which : event.keyCode;
      if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return;
      }
    }

    getCidadesByEstado(estado_id: number){
      this.estadosCidadesService.getCidadesByEstado(estado_id).subscribe((resp: City[]) => {
        this.cidades = resp;
        this.arrayCidades = resp;
      });
      if (this.data.element?.cityId != null){
        setTimeout(() => {
          this.selectCidade.options.filter(item => item.value == this.data.element?.cityId)[0].select();
        },500);
      }
      
    }

    openedState(value): void {
      this.stateInputSearch.nativeElement.focus();
    }

    openedCity(): void {
      this.cityInputSearch.nativeElement.focus();
    }

    onKeyState(value): void{
      this.arrayEstados = []
      let filter = value.toLowerCase();
      for ( let i = 0; i < this.estados.length; i++){
        let option = this.estados[i];
        if (option.nome.toLowerCase().indexOf(filter) >= 0){
          this.arrayEstados.push(option);
        }
      }
    }

    onKeyCity(value): void{
      this.arrayCidades = []
      let filter = value.toLowerCase();
      for ( let i = 0; i < this.cidades.length; i++){
        let option = this.cidades[i];
        if (option.nome.toLowerCase().indexOf(filter) >= 0){
          this.arrayCidades.push(option);
        }
      }
    }

    onSubmit(){
      if (this.form.value.id === ""){
        this.clientService.save(this.form.value).subscribe((resp: Client) => {
          this.toastr.success('Cliente adicionado.');
          this.dialogRef.close(resp);
        });
      } else {
        this.clientService.update(this.form.value).subscribe((resp: Client) => {
          this.toastr.success('Cliente atualizado!');
          this.dialogRef.close(resp);
        });
      }
    }

    ajustesCSS(){
      var mat_select = document.getElementsByClassName('mat-select');
      var mat_dialog = document.getElementsByClassName('mat-dialog-content');
      mat_dialog[0].setAttribute('style','overflow-y: hidden');
      for (var i = 0; i < mat_select.length; i++) {
        mat_select[i].setAttribute('style', 'display: contents');
      }
    }
  }