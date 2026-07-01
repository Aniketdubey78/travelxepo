import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare var google:any

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private router:Router) { }

  Sessionlogout(){
       if (typeof google !== 'undefined' && google?.accounts?.id) {
      google.accounts.id.disableAutoSelect();
    }

    sessionStorage.removeItem("Loggedinuser");

      this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
