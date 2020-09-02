import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OldVisitorPage } from './old-visitor.page';

const routes: Routes = [
  {
    path: '',
    component: OldVisitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OldVisitorPageRoutingModule {}
