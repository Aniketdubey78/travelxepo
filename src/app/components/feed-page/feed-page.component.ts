import { Component, Inject, PLATFORM_ID ,OnInit,OnDestroy,ViewChild,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { PostserviceService } from '../../services/postservice.service';
import { PostModel } from '../../models/postfrom.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-feed-page',
  standalone: false,
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.css'
})
export class FeedPageComponent implements OnInit ,OnDestroy {
  allstories: any[] = [];
  currentstoryItems: any[] = [];
  istroryopen: boolean = false;

  currentuserindex: number = 0;
  currentimageindex: number = 0;

  storytimer: any;
  progessivevalue: number = 0;

  activeuser: string = '';
  activeimages: string = '';


  receivedPost: any;
  allPosts: PostModel[] = [];

  constructor(private router: Router, private postservice: PostserviceService, @Inject(PLATFORM_ID) private platformId: Object) {
    // const navigation = this.router.getCurrentNavigation();
    // this.receivedPost = navigation?.extras?.state?.['newPost'];
  }

   @ViewChild('storiesTrack') storiesTrack!: ElementRef;

  ngOnInit() {

     console.log(this.allPosts)

    this.setupstorycontent();

    if (this.receivedPost) {
      console.log('Received Data:', this.receivedPost);
    } else {
      console.log('No data received from navigation');
    }

    this.postservice.fetchAllPosts().subscribe({
      next: (res: any) => {
        this.allPosts = res.data;
        
      },
      error: (err) => {
        console.error('Error loading posts:', err);
      }
    });


  }

   scrollStories(distance: number) {
    
    this.storiesTrack.nativeElement.scrollBy({
      left: distance,      
      behavior: 'smooth'   
    });
  }

  openstory(index: number) {
    this.istroryopen = true;
    this.currentuserindex = index;
    this.currentimageindex = 0;
    this.loadstories();
  }
  
  setupstorycontent() {
this.postservice.fetchAllStories().subscribe({
      next: (res: any) => {
        this.allstories = res.data || res; 
      
        
      },
      error: (err) => console.error('Error fetching stories:', err)
    });
  }

  loadstories() {
    const userdata = this.allstories[this.currentuserindex];
    if (userdata && userdata.storiesimages && userdata.storiesimages.length > 0) {
      this.currentstoryItems = userdata.storiesimages;
      this.activeimages = this.currentstoryItems[this.currentimageindex];
      this.activeuser = userdata.authorId?.username || 'user'

      this.starttimer();
    } else {
      this.closestory()
    }
  }

  starttimer() {
    if (isPlatformBrowser(this.platformId)) {
      this.progessivevalue = 0;
      if (this.storytimer) clearInterval(this.storytimer)

      this.storytimer = setInterval(() => {
        this.progessivevalue += 1;
        if (this.progessivevalue >= 100) {
          this.nextimage();
        }
      }, 100)
    }
  }

  nextimage() {
    if (this.currentimageindex < this.currentstoryItems.length - 1) {
      this.currentimageindex++;
      this.activeimages = this.currentstoryItems[this.currentimageindex];
      this.starttimer();
    }else{
    this.nextuser();
  }
  }

  nextuser(){
     if (this.currentuserindex < this.allstories.length - 1) {
      this.currentuserindex++;
      this.currentimageindex = 0;
      this.loadstories();
    }else{
    this.closestory();
  }
  }

  closestory() {
     this.istroryopen = false;
    if (this.storytimer) clearInterval(this.storytimer);
    this.currentimageindex = 0;
    this.progessivevalue = 0;
  }

  previmage(){
  if(this.currentimageindex > 0){
  this.currentimageindex--;
  this.activeimages = this.currentstoryItems[this.currentimageindex];
  this.starttimer();
  }else if(this.currentuserindex > 0){
  this.currentuserindex--;
  const prevstories = this.allstories[this.currentuserindex].storiesimages;
   this.currentimageindex = prevstories.length -1;
   this.loadstories();
  }
  }

   ngOnDestroy() {
    if (this.storytimer) clearInterval(this.storytimer);
  }

  postform() {
    this.router.navigate(['/postform']);
  }

  storyform() {
    this.router.navigate(['/storyform']);
  }


}
