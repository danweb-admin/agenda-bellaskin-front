import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Equipament } from 'src/app/shared/models/equipament';
import { ModelAttributes } from 'src/app/shared/models/model-attributes';
import { EquipamentsService } from 'src/app/shared/services/equipaments.service';
import { ModelConfigurationService } from 'src/app/shared/services/model-configuration.service';
import { ModelService } from 'src/app/shared/services/model.service';
import { Person } from '../../../../shared/models/person';

@Component({
    selector: 'app-model-configuration-dialog',
    templateUrl: 'model-configuration-dialog.component.html',
    styleUrls: ['./model-configuration-dialog.component.scss']
  })
  export class ModelConfigurationDialogComponent implements OnInit{
    form: FormGroup;
    isAddMode: boolean;
    id: string;
    dataSource: ModelAttributes[] = [];
    equipament: Equipament[] = [];
    @ViewChild('fileAttribute') fileAttribute: ElementRef;
    @ViewChild('modelFileName') modelFileName: ElementRef;
    @ViewChild('technicalAttribute') technicalAttribute: MatSelect;
    @ViewChild('attributeType') attributeType: MatSelect;
    @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
    attributeTypes: any = [];
    technicalAttr: any = [];

    constructor(
      public dialogRef: MatDialogRef<ModelConfigurationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private equipamentService: EquipamentsService,
      private formBuilder: FormBuilder,
      private modelConfigurationService: ModelConfigurationService,
      private modelService: ModelService,
      private toastr: ToastrService) {
        
    }

    ngOnInit(): void {
      this.loadAttributeTypes();
      this.loadTechnicalAttributes();
      this.loadEquipament();

      this.id = this.data.element;
      this.isAddMode = !this.id;
      
      this.form = this.formBuilder.group({
        id:  [this.data.element?.id || ''],
        name: [this.data.element?.name || '', Validators.required],
        active: [ this.isAddMode ? true : this.data.element?.active, Validators.required],
        modelFileName: [this.data.element?.modelFileName || '', Validators.required],
        equipamentId: [this.data.element?.equipamentId || '', Validators.required],
        createdAt: [this.data.element?.createdAt || new Date()],
        updatedAt: [this.data.element?.updatedsAt || null],
      });
    }

    loadAttributeTypes(){
      this.modelConfigurationService.getAttributeTypes().subscribe((resp: any) => {
        this.attributeTypes = resp;
      })
    }

    loadTechnicalAttributes(){
      this.modelConfigurationService.getTechnicalAttributes().subscribe((resp: any) => {
        this.technicalAttr = resp;
      })
    }

    loadEquipament(){
      this.equipamentService.loadEquipaments(true).subscribe((resp: Equipament[]) => {
        this.equipament = resp;
      })
    }
    
    onClick(){
      const fileUpload = this.fileUpload.nativeElement;
        fileUpload.onchange = (t) => {  
          this.modelFileName.nativeElement.value = t.srcElement.files[0].name;
          this.form.controls['modelFileName'].setValue(t.srcElement.files[0].name);
          this.uploadFile(t.srcElement.files[0]);
        }
        fileUpload.click();    
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    onSubmit(){
      if (this.form.value.id === ""){
        this.modelService.save(this.form.value).subscribe((resp: Person) => {
            this.toastr.success('Modelo de Configuração adicionado.');
            this.dialogRef.close(resp);
        });
      } else {
        this.modelService.update(this.form.value).subscribe((resp: Person) => {
          this.toastr.success('Modelo de Configuração atualizado.');
          this.dialogRef.close(resp);
        });
      }
    }

    uploadFile(file) {  
      const formData = new FormData();  
      formData.append('file', file);  
      
      this.modelService.modelUpload(formData).subscribe((e) => {
        console.log(e);
      });  
    }
  }