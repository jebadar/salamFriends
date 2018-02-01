import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { TimelineComponent } from './timeline/timeline.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { CommentsModule } from '../comments/comments.module';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { SharedModule } from  '../shared/shared.module'
import { BsDropdownModule } from 'ngx-bootstrap';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommentsModule,
    InfiniteScrollModule,
    SharedModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    TimelineComponent, 
    SinglePostComponent,
    ConfirmModalComponent],
  exports:[
    TimelineComponent, SinglePostComponent
  ],
  entryComponents: [
    ConfirmModalComponent
  ]
})
export class PostsModule { }
