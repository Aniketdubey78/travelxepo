import { Component,Inject,PLATFORM_ID } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { CustomerserviceService } from '../../services/customerservice.service';
import { isPlatformBrowser } from '@angular/common';
import { PostserviceService } from '../../services/postservice.service';

@Component({
  selector: 'app-profilepage',
  standalone: false,
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.css'
})
export class ProfilepageComponent {
  
  constructor(private authservice:AuthserviceService,@Inject(PLATFORM_ID) private platformId: Object,private postservice:PostserviceService) {}

 activeTab: 'recent' | 'liked' = 'recent';

 userstoriesdata:any = null;
 isstoryshow:boolean = false;
recentPosts:any =[];
 
    limit:number = 5
   userProfile:any= null;

ngOnInit(){
  if(isPlatformBrowser(this.platformId)){
   const loggeduser = sessionStorage.getItem('Loggedinuser')
   if(loggeduser){
    const userdata = JSON.parse(loggeduser)
    this.userProfile = userdata?.data?.user;
    this.postservice.getuserstory(this.userProfile.id,this.limit).subscribe({
      next:(res:any) => {
      this.userstoriesdata = res.data;
     
      }
    })
    this.postservice.fetchpost(this.userProfile.id).subscribe({
      next:(res:any) => {
        console.log(res.data)
        this.recentPosts.push(res.data);
      }
    })
   }

  }
}
 




  storyshowopen(){
    this.isstoryshow = true;
  }

  stroyshowclose(){
    this.isstoryshow =false;
  }
 

  
  logoutSession(): void {
   this.authservice.Sessionlogout();
    
  }
}
