import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { AppRoutingModule } from '../app-routing/app-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyComponent } from './verify/verify.component';
import { ResetComponent } from './reset/reset.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { PhotosComponent } from './photos/photos.component';
import { ProfileHomeComponent } from './profile-home/profile-home.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfileFriendsComponent } from './profile-friends/profile-friends.component';
import { ProfilePhotosComponent } from './profile-photos/profile-photos.component';
import { FriendsComponent } from './friends/friends.component';
import { PostWrapperComponent } from './post-wrapper/post-wrapper.component';
import { PostTextComponent } from './post-text/post-text.component';
import { PostAudioComponent } from './post-audio/post-audio.component';
import { PostPhotoComponent } from './post-photo/post-photo.component';
import { PostVideoComponent } from './post-video/post-video.component';
import { PostProductComponent } from './post-product/post-product.component';
import { PostsModule } from '../posts/posts.module';
import { NgProgressModule } from 'ng2-progressbar';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { PagesBoxComponent } from './pages-box/pages-box.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { TooltipModule } from 'ngx-bootstrap';
// import { CollapseDirective } from 'ngx-bootstrap'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FileUploadModule,
    AppRoutingModule,
    PostsModule,
    NgProgressModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent, 
    VerifyComponent, 
    ResetComponent,
    ProfileComponent, 
    SettingsComponent, 
    PhotosComponent,
    FriendsComponent, 
    ProfileHomeComponent, 
    ProfileAboutComponent,
    ProfileFriendsComponent, 
    ProfilePhotosComponent, 
    PostWrapperComponent,
    PostTextComponent, 
    PostAudioComponent, 
    PostPhotoComponent, 
    PostVideoComponent,
    PostProductComponent,
    AddFriendComponent, 
    PagesBoxComponent, ActivityLogComponent
  ],
  exports: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    VerifyComponent,
    ResetComponent,
    ProfileComponent,
    SettingsComponent,
    PhotosComponent,
    ProfileHomeComponent,
    ProfileAboutComponent,
    ProfileFriendsComponent,
    ProfilePhotosComponent,
    FriendsComponent,
    PostWrapperComponent,
    AddFriendComponent, 
    PagesBoxComponent
  ],
  providers: [
  ]

})
export class UsersModule { }
