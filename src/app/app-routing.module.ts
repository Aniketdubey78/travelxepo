import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedPageComponent } from './components/feed-page/feed-page.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { LoginComponent } from './components/navbar/login/login.component';
import { RegisterComponent } from './components/navbar/register/register.component';
import { StoriesTemplateComponent } from './components/feed-page/stories-template/stories-template.component';
import { PostDetailsFormComponent } from './components/post-form/post-details-form/post-details-form.component';
import { FulljourneyPageComponent } from './components/feed-page/fulljourney-page/fulljourney-page.component';
import { ForumsPageComponent } from './component/forums-page/forums-page.component';
import { TrendingpageComponent } from './component/trendingpage/trendingpage.component';
import { ProfilepageComponent } from './component/profilepage/profilepage.component';
import { ExploreRouteComponent } from './component/explore-route/explore-route.component';

const routes: Routes = [

  { path: 'feeds', component:FeedPageComponent },
  { path: 'postform', component:PostFormComponent },
  { path: 'login', component:LoginComponent },
  { path: 'register', component:RegisterComponent },
  { path: 'storyform', component:StoriesTemplateComponent },
  { path: 'Full-Journey-Overview', component:FulljourneyPageComponent },
  // { path: 'Full-Journey-Info', component:PostDetailsFormComponent }
   { path: 'Discuss-Forums', component:ForumsPageComponent },
    { path: 'Recent-trend', component:TrendingpageComponent },
     { path: 'User-Dashboard', component:ProfilepageComponent },
      { path: 'Explore-All-Route', component:ExploreRouteComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
