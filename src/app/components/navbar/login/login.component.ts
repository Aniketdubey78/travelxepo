import { Component, Inject, PLATFORM_ID, OnInit, AfterViewInit } from '@angular/core';
import { CustomerserviceService } from '../../../services/customerservice.service';
declare var google: any
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  email: string = '';
  password: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private customerservice: CustomerserviceService, private router: Router) { }

  isLoggedin: boolean = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem("Loggedinuser");
      if (user) {
        this.isLoggedin = true;
      } else {
        this.isLoggedin = false;
      }

      google.accounts.id.initialize({
        client_id: "803627872063-isktuubqe96g580m49a1chhg0ffeurhr.apps.googleusercontent.com",
        callback: (response: any) => { this.handlelogin(response) },
        "ux_mode": "popup"
      });

    }
  }
  decodetoken(token: any) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  handlelogin(response: any) {
    console.log('handlelogin called with response:', response);

    const payload = this.decodetoken(response.credential);
    console.log('Decoded payload:', payload);
    if (payload) {
      this.customerservice.login(payload).subscribe({
        next: (res) => {
          console.log('Login successful, response:', res);
          sessionStorage.setItem("Loggedinuser", JSON.stringify(res));
          this.router.navigate(['/feeds']).then(() => {
            window.location.reload();
          });

        }
      });


    } else {
      console.log('Payload is null, not saving');
    }

  }

  ngAfterViewInit() {
    this.rendergooglebutton();
  }


  rendergooglebutton() {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof google !== 'undefined') {
        const googlebtn = document.getElementById("google-btn");
        if (googlebtn) {
          google.accounts.id.renderButton(googlebtn, {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "pill",
            Logi_allignment: "center",
            width: "370"
          });
        }
      } else {
        setTimeout(() => this.rendergooglebutton(), 500);
      }
    }
  }
  onsubmit() {
    if (this.email && this.password) {
      const user = {
        email: this.email,
        password: this.password
      }
      this.customerservice.login(user).subscribe({
        next: (res) => {
          console.log('Login successful, response:', res);
          sessionStorage.setItem("Loggedinuser", JSON.stringify(res));
          this.router.navigate(['/feeds']);
        }
      });
    }

  }
  // handlelogout() {
  //   google.accounts.id.disableAutoSelect();
  //   sessionStorage.removeItem("Loggedinuser");
  //   window.location.reload();
  // }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
