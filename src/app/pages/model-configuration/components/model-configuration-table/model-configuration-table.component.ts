import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ModelConfigurationDialogComponent } from '../model-configuration-dialog/model-configuration-dialog.component';
import { ModelService } from 'src/app/shared/services/model.service';


@Component({
  selector: 'app-model-configuration-table',
  templateUrl: './model-configuration-table.component.html',
  styleUrls: ['./model-configuration-table.component.scss']
})
export class ModelConfigurationTableComponent implements OnInit {
  public dataSource: any[] = [];

  constructor(public dialog: MatDialog,
    private modelService: ModelService) {}

  public ngOnInit(): void {
    this.loadModels();
  }

  loadModels(){
    this.modelService.loadModels().subscribe((resp: any[]) => {
      this.dataSource = resp;
      console.log(resp);
    });
  }

  public showAtivo(ativo: boolean): string {
    if (ativo)
      return 'Ativo';
    return 'Inativo';
  }

  openDialog(element: any): void {
    
    const dialogRef = this.dialog.open(ModelConfigurationDialogComponent, {
      width: '800px',
      height: '400px',
      data: {element}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined)
        return;

      this.loadModels();
    });
  }
}