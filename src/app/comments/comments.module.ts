import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisplayComponent } from './display/display.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [DisplayComponent, AddCommentComponent],
  exports: [
    AddCommentComponent, DisplayComponent
  ]
})
export class CommentsModule { }
