import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { VeriMarkerCommonUiRoutingModule } from './verimarker-common-ui-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

import {  AlertDialogComponent } from './common-ui';
import { UserRegistrationComponent } from './component/user-registration/user-registration.component';
import { SubmissionsHistoryComponent } from './component/submissions-history/submissions-history.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgxSpinnerModule,
    VeriMarkerCommonUiRoutingModule,
    FormsModule,
  ],
  entryComponents: [
    AlertDialogComponent,
  ],
  declarations: [
    AlertDialogComponent,
    UserRegistrationComponent,
    SubmissionsHistoryComponent 
  ]
})
export class VerimarkerCommonUiModule { }
