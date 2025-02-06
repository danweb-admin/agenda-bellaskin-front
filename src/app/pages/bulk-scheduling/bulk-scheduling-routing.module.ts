import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BulkSchedulingPageComponent } from './containers/bulk-scheduling-page/bulk-scheduling-page.component';


const routes: Routes = [
  {
    path: '',
    component: BulkSchedulingPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class BulkSchedulingRoutingModule {
}
