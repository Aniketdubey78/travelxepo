import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeserviceService } from '../../services/themeservice.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthserviceService } from '../../services/authservice.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isLoggedin: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private themes: ThemeserviceService,private authservice:AuthserviceService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem("Loggedinuser");
      if (user) {
        this.isLoggedin = true;
      } else {
        this.isLoggedin = false;
      }

    }
  }
  
  get isDark(): boolean {
    return this.themes.isdarkmode();
  }

  toggletheme() {
    this.themes.themetoggle();
  }

  handleSignIn() {
    this.router.navigate(['/login']);
  }

  Signout(){
   this.authservice.Sessionlogout()
  }

}
