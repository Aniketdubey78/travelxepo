import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CommonModule } from '@angular/common';
import { withFetch, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FeedPageComponent } from './components/feed-page/feed-page.component';
import { LeftNavComponent } from './components/left-nav/left-nav.component';
import { RightNavComponent } from './components/right-nav/right-nav.component';
import { BottamNavComponent } from './components/bottam-nav/bottam-nav.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './components/navbar/login/login.component';
import { RegisterComponent } from './components/navbar/register/register.component';
import { PostTemplateComponent } from './components/feed-page/post-template/post-template.component';
import { AvatarPipe } from './pipes/avatar.pipe';
import { TimeagoPipe } from './pipes/timeago.pipe';
import { StoriesTemplateComponent } from './components/feed-page/stories-template/stories-template.component';
import { authInterceptor } from './intercepters/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NotificationComponent } from './components/feed-page/notification/notification.component';
import { PostDetailsFormComponent } from './components/post-form/post-details-form/post-details-form.component';
import { FulljourneyPageComponent } from './components/feed-page/fulljourney-page/fulljourney-page.component';
import { ExploreRouteComponent } from './component/explore-route/explore-route.component';
import { ProfilepageComponent } from './component/profilepage/profilepage.component';
import { TrendingpageComponent } from './component/trendingpage/trendingpage.component';
import { ForumsPageComponent } from './component/forums-page/forums-page.component';


const config: SocketIoConfig = { url: 'http://localhost:4000', options: { transports: ['websocket','polling'], 
    autoConnect: false} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FeedPageComponent,
    LeftNavComponent,
    RightNavComponent,
    BottamNavComponent,
    PostFormComponent,
    LoginComponent,
    RegisterComponent,
    PostTemplateComponent,
    AvatarPipe,
    TimeagoPipe,
    StoriesTemplateComponent,
    NotificationComponent,
    PostDetailsFormComponent,
    FulljourneyPageComponent,
    ExploreRouteComponent,
    ProfilepageComponent,
    TrendingpageComponent,
    ForumsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    BrowserAnimationsModule,
      SocketIoModule.forRoot(config),
       ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true
    })
  ],
  providers: [
    provideHttpClient(withFetch()
  ,withInterceptors([authInterceptor])
)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
