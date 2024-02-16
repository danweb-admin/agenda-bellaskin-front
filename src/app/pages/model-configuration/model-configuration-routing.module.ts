import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ModelConfigurationPageComponent } from './containers/model-configuration-page/model-configuration-page.component';


const routes: Routes = [
    {
        path: '',
        component: ModelConfigurationPageComponent
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class ModelConfigurationRoutingModule {
}
