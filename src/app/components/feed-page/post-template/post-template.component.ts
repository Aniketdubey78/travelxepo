import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { PostserviceService } from '../../../services/postservice.service';
import { CustomerserviceService } from '../../../services/customerservice.service';
import { userInfo } from 'os';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-template',
  standalone: false,
  templateUrl: './post-template.component.html',
  styleUrl: './post-template.component.css'
})
export class PostTemplateComponent {
  constructor(private router:Router,  private postservice: PostserviceService, @Inject(PLATFORM_ID) private platformId: Object) { }
  content: string = '';
  postId: any;
  //  userId:any;

  @Input() posts: any;

 

  get isuserlogin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!sessionStorage.getItem('Loggedinuser');
    }
    return false;
  }



  submitcomment() {
    if (isPlatformBrowser(this.platformId)) {
      const userstring = sessionStorage.getItem('Loggedinuser');
      if (this.content  && userstring) {
         console.log(this.content);
        const author = JSON.parse(userstring);
        const userId = author?.data?.user?.id;
        console.log(this.content);
        const commentData = {
          content: this.content,
          postId: this.posts._id,
          userId: userId
        };

        console.log(commentData);
        this.postservice.commentpost(commentData).subscribe({
          next: (res) => {
            console.log('Comment submitted successfully:', res);
            this.content = '';
          }
        })
      } else {
        alert('Please enter a comment before submitting.');
      }
    }else {
      alert('Comments can only be submitted from a browser environment.');
    }
  }

  explore(){
    this.router.navigate(['/Full-Journey-Overview'],{
      state:{
        currentpost:this.posts
      }
    })
  }
}
