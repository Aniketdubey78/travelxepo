import { Component, OnInit, OnDestroy ,Inject,PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { ForumSocketServiceService } from '../../services/forum-socket-service.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-forums-page',
  standalone: false,
  templateUrl: './forums-page.component.html',
  styleUrl: './forums-page.component.css'
})
export class ForumsPageComponent {
 forums: any[] = [];

  
  newForumTitle: string = '';
  newForumDescription: string = '';
  newForumCategory: string = 'General';
  showForm: boolean = false;

  currentUserId: string = '';
  activeForumId: string | null = null;
  newMessageText: string = '';

  
  private subscriptions: Subscription = new Subscription();

  constructor(private forumSocketService: ForumSocketServiceService,@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {


    
    this.currentUserId = "";

    if(isPlatformBrowser(this.platformId)){
       const user = sessionStorage.getItem("Loggedinuser");
        if (user) {
          const userData = JSON.parse(user);
          console.log(userData);
          
          this.currentUserId = userData.data?.user?.name || userData.data?.user?.email || 'User';
    
        } else {
          this.currentUserId = 'guest user';
        }
     }

    this.forumSocketService.connectSocket();
    this.forumSocketService.getInitialForums();

    
    this.subscriptions.add(
      this.forumSocketService.onInitialForumsLoaded().subscribe((data: any[]) => {
        this.forums = data;
      })
    );

    
    this.subscriptions.add(
      this.forumSocketService.onNewForumCreated().subscribe((newForum: any) => {
        this.forums.unshift(newForum);
      })
    );

    
    this.subscriptions.add(
      this.forumSocketService.getMessages().subscribe((msgData: any) => {
        const targetForum = this.forums.find(f => f._id === msgData.forumId);
        if (targetForum) {
          if (!targetForum.messages) {
            targetForum.messages = [];
          }
          targetForum.messages.push(msgData);
        }
      })
    );

    
    this.subscriptions.add(
      this.forumSocketService.onError().subscribe((err: any) => {
        alert('Server Error: ' + err.message);
      })
    );
  }

  toggleForumDropdown(forumId: string): void {
    if (this.activeForumId === forumId) {
      this.activeForumId = null;
    } else {
      this.activeForumId = forumId;
      this.forumSocketService.joinForum(forumId, this.currentUserId);
    }
  }

  onCreateForumSubmit(): void {
    if (!this.newForumTitle.trim() || !this.newForumDescription.trim()) return;

    this.forumSocketService.createNewForum(
      this.newForumTitle,
      this.newForumDescription,
      this.newForumCategory
    );

    this.newForumTitle = '';
    this.newForumDescription = '';
    this.newForumCategory = 'General';
    this.showForm = false;
  }

  onSendMessage(forumId: string): void {
    if (!this.newMessageText.trim()) return;
    this.forumSocketService.sendMessage(forumId, this.currentUserId, this.newMessageText);
    this.newMessageText = '';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
