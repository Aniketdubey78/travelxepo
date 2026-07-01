import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
interface ProcessedNotification {
  id: String,
  type: String,
  message: String,
  icon: string,
  displaymessage: String,
  ownername: String,
  createAt: Date
}

@Component({
  selector: 'app-right-nav',
  standalone: false,
  templateUrl: './right-nav.component.html',
  styleUrl: './right-nav.component.css'
})
export class RightNavComponent {


  limit: number = 20;
  page: number = 1;

  private iconMap: { [key: string]: string } = {
    'NEW_LIKE': '❤️',
    'NEW_COMMENT': '💬',
    'NEW_STORY': '📸',
    'NEW_POST': '📝'
  };

  notifications: ProcessedNotification[] = [];


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private notfiationserveice: NotificationService, private http: HttpClient) { }
 
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
       const user = !!sessionStorage.getItem("Loggedinuser");
       if(user){
      this.loadnotification();
       }else{
        console.log("singing in to see the notification")
       }
    }
  }

  loadnotification() {
    this.notfiationserveice.fetchallnotifications(this.page, this.limit).subscribe({
      next: (response: any) => {
      
        const notificationsArray = response?.data;
        
        if (notificationsArray && notificationsArray.length > 0) {
         
          this.processincomingnotification(notificationsArray);
          this.page++;
        }
      },
      error: (err) => {
        console.error('Failed to fetch notifications from service', err);
      }
    })
  }

  processincomingnotification(newdata: any[]) {
    const newlyProcessedBatch: ProcessedNotification[] = newdata.map(notif => {

      const actor = notif.name || 'Someone';
      let rawMsg = notif.comment || notif.Highlight || '';
      let dynamicOwner = notif.name || 'User';


      if (rawMsg.length > 20) {
        rawMsg = rawMsg.substring(0, 20) + '...';
      }


      let finalPhrase = '';

      switch (notif.type) {
        case 'NEW_STORY':
          finalPhrase = `${actor} added a story`;
          break;

        case 'NEW_POST':
          finalPhrase = `Post Highlight: "${rawMsg}"`;
          dynamicOwner = notif.authorName;
          break;

        case 'NEW_LIKE':
          finalPhrase = `${actor} liked your photo`;
          break;

        case 'NEW_COMMNET':
          finalPhrase = `Commented: "${rawMsg}"`;
          dynamicOwner = notif.actorName;
          break;

        default:
          finalPhrase = rawMsg || 'New notification update context received';
      }


      return {
        id: notif._id || notif.id,
        type: notif.type,
        message: notif.message,
        icon: this.iconMap[notif.type] || '🔔',
        displaymessage: finalPhrase,
        ownername: dynamicOwner,
        createAt: notif.createdAt || notif.createAt || new Date()
      };
    });


    this.notifications = [...this.notifications, ...newlyProcessedBatch];
   
  }

}
