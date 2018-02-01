import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../layout/main/main.component';
import { WelcomeComponent } from '../layout/welcome/welcome.component';
import { ProfileComponent } from '../users/profile/profile.component';
import { AppGuardGuard } from '../app-routing/app-guard.guard';
import { VerifyComponent } from '../users/verify/verify.component';
import { RegisterComponent } from '../users/register/register.component';
import { ResetComponent } from '../users/reset/reset.component';
import { ProfileHomeComponent } from '../users/profile-home/profile-home.component';
import { ProfileAboutComponent } from '../users/profile-about/profile-about.component';
import { ProfileFriendsComponent } from '../users/profile-friends/profile-friends.component'
import { ProfilePhotosComponent } from '../users/profile-photos/profile-photos.component'
import { FeedMainComponent } from '../feed/feed-main/feed-main.component'
import { InboxComponent } from '../chat/inbox/inbox.component'
import { ListComponent } from '../page/list/list.component'
import { PageMainComponent} from '../page/page-main/page-main.component'
import { AboutComponent } from '../page/about/about.component'
import { PostsComponent } from '../page/posts/posts.component'
import { VideosComponent } from '../page/videos/videos.component'
import { PhotosComponent } from '../page/photos/photos.component'
import { HomeComponent } from '../page/home/home.component'
import { PageWrapperComponent } from '../page/page-wrapper/page-wrapper.component'
import { ActivityLogComponent } from '../users/activity-log/activity-log.component'

const routes: Routes = [
    {
        path: '',
        component: MainComponent, canActivate: [AppGuardGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [AppGuardGuard],
                children: [
                    { path: '', component: ProfileHomeComponent },
                    { path: 'about', component: ProfileAboutComponent },
                    { path: 'friends', component: ProfileFriendsComponent },
                    { path: 'photos', component: ProfilePhotosComponent },
                ]
            },
            {
                path: 'user/:id', component: ProfileComponent,
                data: { searchCheck: true },
                canActivate: [AppGuardGuard],
                children: [
                    { path: '', component: ProfileHomeComponent,data: { searchCheck: true } },
                    { path: 'friends', component: ProfileFriendsComponent,data: { searchCheck: true } },
                    { path: 'photos', component: ProfilePhotosComponent,data: { searchCheck: true } },
                ]
            },
            {
                path:'feed',
                component:FeedMainComponent,
                canActivate:[AppGuardGuard]
            },
            {
                path:'inbox',
                component:InboxComponent,
                canActivate:[AppGuardGuard]
            },
            {
                path:'activity',
                component:ActivityLogComponent,
                canActivate:[AppGuardGuard]
            },
            {
                path:'page/:id',
                component:PageWrapperComponent,
                canActivate:[AppGuardGuard],
                children: [
                    { path: '', component: HomeComponent },
                    { path: 'about', component: AboutComponent },
                    { path: 'photos', component:  PhotosComponent},
                    { path: 'videos', component:  VideosComponent},
                    { path: 'posts', component:  PostsComponent}
                ]
            }
        ]
    },
    {
        path: 'welcome',
        component: WelcomeComponent,
        children: [
            { path: 'verify/:accessTokken', component: VerifyComponent },
            { path: '', component: RegisterComponent },
            { path: 'reset/:accessTokken', component: ResetComponent }
        ]
    },


];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }