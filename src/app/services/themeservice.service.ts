import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeserviceService {
  darktheme: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const theme = localStorage.getItem('theme');
      if (theme == 'dark') {
        this.enabledarktheme();
      }
    }
  }

  enabledarktheme() {
    document.documentElement.setAttribute('dark-mode', 'dark');
    localStorage.setItem('theme', 'dark');
    this.darktheme = true;
  }

  enablelighttheme() {
    document.documentElement.removeAttribute('dark-mode');
    localStorage.setItem('theme', 'light');
    this.darktheme = false;
  }

  themetoggle() {
    this.darktheme = !this.darktheme
    if (this.darktheme) {
      this.enabledarktheme();
    } else {
      this.enablelighttheme();
    }
  }

  isdarkmode() {
    return this.darktheme;
  }
}
