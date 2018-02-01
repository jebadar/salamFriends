import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LightboxModule } from 'angular2-lightbox';
import { UserServicesService } from './users/user-services.service';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { AppGuardGuard } from '../app/app-routing/app-guard.guard';
import { HttpServicesService } from '../app/app-services/http-services.service';
import { LocStoreService } from '../app/app-services/loc-store.service'
import { AppComponent } from './app.component';
import { PostServicesService } from './posts/post-services.service';
import { CommentServicesService } from './comments/comment-services.service';
import { FeedModule } from './feed/feed.module'
import { FeedService } from './feed/feed.service'
import { ChatModule } from './chat/chat.module'
import { PageModule } from './page/page.module'
import { PageService } from './page/page.service'
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

@NgModule({
  declarations: [
    AppComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    LayoutModule,
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    FeedModule,
    LightboxModule,
    ChatModule,
    PageModule,
    BootstrapModalModule
  ],
  providers: [UserServicesService, PostServicesService, 
    CommentServicesService,
    AppGuardGuard,
    HttpServicesService,
    LocStoreService,
    FeedService,
    PageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
