import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { DpComponent } from './dp/dp.component';
import { CollapseDirective } from 'ngx-bootstrap';
import { ProgressBarComponent } from './progress-bar/progress-bar.component'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoaderComponent, DpComponent, CollapseDirective, ProgressBarComponent],
  exports:[LoaderComponent, DpComponent, CollapseDirective, ProgressBarComponent]
})
export class SharedModule { }
