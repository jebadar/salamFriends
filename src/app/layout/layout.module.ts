import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from '../app-routing/app-routing.module';
// import { CollapseDirective } from 'ngx-bootstrap'
import { UsersModule } from '../users/users.module';
import { Ng2CompleterModule } from "ng2-completer";
import { FormsModule } from '@angular/forms';
import { SfremoteDataFactoryProvider } from "./sfremote.factory"
import { SharedModule } from '../shared/shared.module'
import { BsDropdownModule } from 'ngx-bootstrap';
import { StatusService } from '../shared/status-service/status.service'

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    UsersModule,
    Ng2CompleterModule,
    FormsModule,
    SharedModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [WelcomeComponent, MainComponent],
  providers: [SfremoteDataFactoryProvider, StatusService]
})
export class LayoutModule { }
