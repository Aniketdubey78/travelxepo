import { Component,Inject,PLATFORM_ID } from '@angular/core';
import { CustomerserviceService } from '../../services/customerservice.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-nav',
  standalone: false,
  templateUrl: './left-nav.component.html',
  styleUrl: './left-nav.component.css'
})
export class LeftNavComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router:Router){}
userdata:any='';
ngOnInit(){
 if(isPlatformBrowser(this.platformId)){
   const user = sessionStorage.getItem("Loggedinuser");
    if (user) {
      const userData = JSON.parse(user);
      console.log(userData);
      
      this.userdata = userData.data?.user?.name || userData.data?.user?.email || 'User';

    } else {
      this.userdata = 'guest user';
    }
 }
}

// Explorefeed(){
// this.router.navigate(['/feeds'])
// }

// Exploreroute(){
// this.router.navigate(['/Explore-All-Route'])
// }
// ExploreForums(){
// this.router.navigate(['/Discuss-Forums'])
// }
// Exploretranding(){
// this.router.navigate(['/Recent-trend'])
// }
// Userprofile(){
// this.router.navigate(['/User-Dashboard'])
// }
}
