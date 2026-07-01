import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { PostserviceService } from '../../../services/postservice.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stories-template',
  standalone: false,
  templateUrl: './stories-template.component.html',
  styleUrl: './stories-template.component.css'
})
export class StoriesTemplateComponent {
  isuploading: boolean = false;
  authorId: string = '';
  storiesimages: string[] = [];
  maxLimit: number = 10; 
  

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router,
    private postservice: PostserviceService
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem('Loggedinuser');
      if (user) {
        const userdetails = JSON.parse(user);
        
        this.authorId = userdetails.data?.user?.id || userdetails.user?.id;
       
      }
    }
  }

  OnFileChange(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // --- MAX LIMIT LOGIC START ---
    if (this.storiesimages.length + files.length > this.maxLimit) {
      alert(`You can only upload a maximum of ${this.maxLimit} images.`);
      return;
    }
    // --- MAX LIMIT LOGIC END ---

    this.isuploading = true;
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const formdata = new FormData();
      formdata.append('file', files[i]);
      formdata.append('upload_preset', 'hnzmcbau');

      this.http.post('https://api.cloudinary.com/v1_1/dxhpatmvu/image/upload', formdata).subscribe({
        next: (response: any) => {
          this.storiesimages.push(response.secure_url);
          uploadedCount++;
          if (uploadedCount === files.length) {
            this.isuploading = false;
          }
          console.log("Image uploaded successfully:", this.storiesimages);
        },
        error: (err) => {
          console.error("Cloudinary Upload Error:", err);
          this.isuploading = false;
        }
      });
    }
  }

  uploadStory() {
    if (isPlatformBrowser(this.platformId)) {
      const loggeduser = sessionStorage.getItem('Loggedinuser');

      if (!loggeduser) {
        return alert('Please login to share your stories');
      }
      if (this.isuploading) {
        return alert('Please wait till image uploadation is complete');
      }
      if (!this.authorId) {
        return alert('Cannot find the authorId of that stories');
      }
      if (this.storiesimages.length === 0) {
        return alert('Please upload at least one image');
      }

      const story = {
        authorId: this.authorId,
        storiesimages: this.storiesimages,
        
      };

      this.postservice.StoryPost(story).subscribe({
        next: (res: any) => {
          console.log("Story shared:", res);
          this.router.navigate(['/feeds']);
        },
        error: (err) => console.log('The error is', err)
      });
    }
  }

  // इमेज हटाने का सही लॉजिक
  removeImage(index: number) {
    this.storiesimages.splice(index, 1);
  }
}
