import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedMainComponent } from './feed-main/feed-main.component';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { PageModule } from '../page/page.module'

@NgModule({
  imports: [
    CommonModule,
    UsersModule,
    PostsModule,
    InfiniteScrollModule,
    SharedModule,
    PageModule
  ],
  declarations: [FeedMainComponent, MenuComponent],
  exports:[FeedMainComponent, MenuComponent]
})
export class FeedModule { }
