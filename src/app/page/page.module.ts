import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { PageMainComponent } from './page-main/page-main.component';
import { UsersModule} from '../users/users.module'
import { PostsModule} from '../posts/posts.module';
import { AboutComponent } from './about/about.component';
import { PhotosComponent } from './photos/photos.component';
import { VideosComponent } from './videos/videos.component';
import { PostsComponent } from './posts/posts.component'
import { AppRoutingModule } from '../app-routing/app-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';
import { PageSettingComponent } from './page-setting/page-setting.component';
import { ConfirmComponent } from './confirm/confirm.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    UsersModule,
    PostsModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  declarations: [ListComponent, PageMainComponent,
    AboutComponent, PhotosComponent,
    VideosComponent, PostsComponent, HomeComponent,
    PageWrapperComponent,
    PageSettingComponent,
    ConfirmComponent],
  exports:[ListComponent,
    AboutComponent, PhotosComponent,
    VideosComponent, PostsComponent,
    PageWrapperComponent,
    PageSettingComponent],
    entryComponents: [
      ConfirmComponent
    ]
})
export class PageModule { }
