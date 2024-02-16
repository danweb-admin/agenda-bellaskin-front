import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GenerateContractPageComponent } from './containers/generate-contract-page/generate-contract-page.component';

const routes: Routes = [
    {
        path: '',
        component: GenerateContractPageComponent
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class GenerateContractRoutingModule {
}
