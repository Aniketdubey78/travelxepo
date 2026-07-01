import { Component ,OnDestroy,OnInit,Inject,PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {  Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy ,OnInit{
  title = 'Travelxepo';
  loginuser:any;
  logindetails:any

 private notificationSubscription: Subscription | undefined;
  constructor(public router:Router,private notifService:NotificationService,private toastr:ToastrService,@Inject(PLATFORM_ID) private platformId: Object){}
  isAuthpage(): boolean{
      const authPages = ['/login', '/register'];
    return authPages.includes(this.router.url);
  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      const logindetails = sessionStorage.getItem('Loggedinuser');
      const user =JSON.parse(logindetails || '{}');
      this.logindetails = user;
      this.loginuser = user?.data?.user.id || null;

    }
    this.handleSocketNotifications();
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
      console.log('Notification listener cleaned up!');
    }
  }

  handleSocketNotifications() {
    this.notifService.listentoNotification().subscribe((data) => {
      console.log('Received notification:', data);
      this.displayToast(data);
    });

 
  }

  displayToast(data: any) {
   

    switch (data.type) {
      case 'NEW_POST':
        this.toastr.success(`${data.userId.username} has created a new blog post.`, 'New Blog 🚌', { positionClass: 'toast-top-right' });
        break;
      
      case 'NEW_STORY':
        
        this.toastr.info(`${data.userId.username} has added a new story.`, 'New Story 🤳', { toastClass: 'ngx-toastr story-toast' });
        break;

     case 'NEW_COMMENT':
    
      if (this.loginuser === data.userId && this.loginuser !== data.senderId) {
        
        const commenterName = data.name || 'Someone';
        
        this.toastr.info(`${commenterName} has commented on your post.`, 'New Comment 💬');
      }
      break;

    case 'LIKE':
    
      if (this.loginuser === data.userId && this.loginuser !== data.senderId?._id) {
        const likerName = data.senderId?.username || 'Someone';
        this.toastr.warning(`${likerName} liked your post.`, 'Post Liked ❤️');
      }
      break;

    case 'SAVE':
      if (this.loginuser === data.userId && this.loginuser !== data.senderId?._id) {
        const saverName = data.senderId?.username || 'Someone';
        this.toastr.warning(`${saverName} saved your post.`, 'Post Saved 💾');
      }
      break;
    }
  }
}
