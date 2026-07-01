
import { Component, Inject, PLATFORM_ID ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { PostserviceService } from '../../services/postservice.service';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-post-form',
  standalone: false,
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  isuploading: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private route: Router, private http: HttpClient, private postservice: PostserviceService) { }
  title: string = "";
  busoperator: string = "";
  routefrom: string = "";
  routeto: string = "";
  rating: number = 0;
  highlight: string = "";
  pitshops: string[] = [];
  currentstop: string = "";
  fullstory: string = "";
  image: string[] = []; 
  postUUID:string="";

ngOnInit() {
  this.postUUID = self.crypto.randomUUID();
}
  addpitshps() {
    if (this.currentstop.trim() !== "") {
      this.pitshops.push(this.currentstop);
      this.currentstop = "";
      console.log(this.pitshops);
    } else {
      alert("Please enter a valid pit stop.");
    }
  }



  removepitshop(index: number) {
    this.pitshops.splice(index, 1);
  }

  formevent(option: string) {
    this.routefrom = option;
  }

  toevent(option: string) {
    this.routeto = option;
  }

  FileChange(event: any) {
    this.isuploading = true;
    const file = event.target.files;
    let uploadedCount = 0;
    if (file && file.length > 0) {
      for (let i = 0; i < file.length; i++) {
        const formdata = new FormData();
        formdata.append('file', file[i]);
        formdata.append('upload_preset', 'hnzmcbau');
        this.http.post('https://api.cloudinary.com/v1_1/dxhpatmvu/image/upload', formdata).subscribe((response: any) => {
          this.image.push(response.secure_url);
          uploadedCount++;
          if (uploadedCount === file.length) {
            this.isuploading = false;
          }
          console.log("Image uploaded successfully:", this.image);
        });
      }
    }
  }

  submitPost() {
    const loggedinuser = sessionStorage.getItem('Loggedinuser');
    console.log(loggedinuser);


    if (isPlatformBrowser(this.platformId)) {
      if (!loggedinuser) {
        alert("You must be logged in to submit a post.");
        return;
      }

      if (this.isuploading) {
        alert("Please wait for the image to finish uploading.");
        return;
      }
      if (!this.title) {
        alert("Please enter a title for your post.");
        return;
      }

      try {
        if (loggedinuser) {
          const parsedata = JSON.parse(loggedinuser);

          const userdata = parsedata.data.user
          const usertoken = parsedata.data.token

          const postData = {
            title: this.title,
            busoperator: this.busoperator,
            routefrom: this.routefrom,
            routeto: this.routeto,
            rating: this.rating,
            highlight: this.highlight,
            pitshops: this.pitshops,
            fullstory: this.fullstory,
            image: this.image,
            authorId: userdata.id,
            logindetails: usertoken,
            postUUID: this.postUUID
          };


          this.postservice.postrequest(postData).subscribe({
            next: (response: any) => {
              console.log("Post submitted successfully:", response);
              this.route.navigate(['/feeds'], { state: { newPost: response } });
            }
          })
        }
      } catch (error) {
        console.error("Storage Error:", error);
        sessionStorage.removeItem('Loggedinuser');
      }


    }
  }

  
  
}
