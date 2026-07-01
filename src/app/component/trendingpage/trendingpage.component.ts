import { Component } from '@angular/core';
import { PostserviceService } from '../../services/postservice.service';
import { ForumSocketServiceService } from '../../services/forum-socket-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trendingpage',
  standalone: false,
  templateUrl: './trendingpage.component.html',
  styleUrl: './trendingpage.component.css'
})
export class TrendingpageComponent {


  mostLikedPosts = [
    {
      title: 'The 6AM Luxury Volvo Expedition',
      from: 'Delhi',
      to: 'Manali',
      operator: 'Zingbus Luxury',
      likes: 847,
      rating: 5,
      summary: 'Awesome journey it is full of joy and comfortable sleeper berths which make long tracking intervals super comfortable.',
      banner: 'https://unsplash.com'
    },
    {
      title: 'Chasing Sunsets across Western Ghats',
      from: 'Mumbai',
      to: 'Pune',
      operator: 'MSRTC Shivneri',
      likes: 621,
      rating: 4,
      summary: 'Boarded the earliest bus out of Mumbai on a foggy Tuesday. The sun cutting through mist above the Ghats was pure gold.',
      banner: 'https://unsplash.com'
    }
  ];


  highCommentPosts = [
    { title: 'Is traveling via overnight sleeper safe for solo female backpackers?', author: 'Aniket!2', comments: 124, likes: 98, time: '2 hours ago', banner: 'https://unsplash.com' },
    { title: 'List of cleanest local highway dhabas on Delhi-Manali route', author: 'Priya_Travels', comments: 89, likes: 156, time: '4 hours ago', banner: 'https://unsplash.com' },
    { title: '#amazing experience booking last-minute seats via premium applications', author: 'Rahul_Go', comments: 42, likes: 78, time: '1 day ago', banner: 'https://unsplash.com' }
  ];


  hotForums = [
    { topic: 'Discuss-Forums: Monsoon bus delays & bypass strategies', activeUsers: 142 },
    { topic: 'Backpacker Secrets: Best cheap stays in Old Manali near cafés', activeUsers: 95 },
    { topic: 'Operator Reviews: Zingbus vs IntrCity SmartBus comparison', activeUsers: 84 },
    { topic: 'Recent-trend: Hidden photography lookouts in Haridwar routes', activeUsers: 51 }
  ];
  topContributorName: String = "Loding..."
  topContributorCount: number = 0
  Allposts: any[] = [];
  Allforems: any[] = [];
  constructor(private postservice: PostserviceService, private foremservice: ForumSocketServiceService, private router: Router) { }

ngOnInit(): void {
  this.postservice.fetchAllPosts().subscribe({
    next: (res: any) => {
      const rawPosts = Array.isArray(res) ? res : (res.data || []);
      
      
      this.Allposts = rawPosts.sort((a: any, b: any) => {
        return (b.likedcount || 0) - (a.likedcount || 0);
      });

      
      this.calculateTopContributor(this.Allposts);
      
      
      console.log('All Posts Sorted by Likes inside subscribe:', this.Allposts);
    },
    error: (err: any) => {
      console.error('Error fetching posts:', err);
    }
  });
  
  
  this.loadallforem();
}

  loadallforem() {
    this.foremservice.fetchrecentforem().subscribe({
      next: (res: any) => {
        this.Allforems = Array.isArray(res) ? res : (res.data || []);
        console.log('All Forums:', this.Allforems);
      },
      error: (err: any) => {
        console.error('Error fetching forums:', err);
      }
    });
  }
  Exploreforum() {
    this.router.navigate(['/Discuss-Forums'])
  }
  calculateTopContributor(posts: any[]): void {
    if (!posts || posts.length === 0) {
      this.topContributorName = 'No Contributor';
      return;
    }


    const userCountMap: { [key: string]: { count: number, email: string } } = {};

    posts.forEach(post => {
      const author = post.authorId;
      if (author && author.username) {
        const username = author.username;
        const email = author.email || '';

        if (userCountMap[username]) {
          userCountMap[username].count += 1;
        } else {
          userCountMap[username] = { count: 1, email: email };
        }
      }
    });


    let maxPosts = 0;
    let bestUser = '';


    for (const username in userCountMap) {
      if (userCountMap[username].count > maxPosts) {
        maxPosts = userCountMap[username].count;
        bestUser = username;

      }
    }


    this.topContributorName = bestUser || 'Anonymous';
    this.topContributorCount = maxPosts;
  }
}
