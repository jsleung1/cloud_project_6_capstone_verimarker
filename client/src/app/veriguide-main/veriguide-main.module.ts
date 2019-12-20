import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideMainRoutingModule } from './veriguide-main-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../veriguide-common-type/common-factory';
import { MainMenuComponent } from './main-menu/main-menu.component';

@NgModule({
  imports: [
    CommonModule,
    VeriguideMainRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [MainMenuComponent]
})
export class VeriguideMainModule { }