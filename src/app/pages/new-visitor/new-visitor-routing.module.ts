import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewVisitorPage } from './new-visitor.page';

const routes: Routes = [
  {
    path: '',
    component: NewVisitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewVisitorPageRoutingModule {}
