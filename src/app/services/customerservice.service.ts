import { Injectable } from '@angular/core';
import { url } from '../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CustomerserviceService {
   private apiurl = url ;
   loggeduser:any={};
   registerdata:any={};
  constructor(private http:HttpClient) {  }


  register(user:any):Observable<User>{
    const ragisterdata = {
      username: user.username,
      email: user.email,
      password: user.password,
      age: user.age,
      gender: user.gender
    }
    return this.http.post<User>(this.apiurl + '/auth/register', ragisterdata).pipe(
      tap((res:any) => {
        this.registerdata = res;
         console.log('Backend Response saved in Service:', this.registerdata);
      })
    )
  }
  
  login(user:any):Observable<User>{
    const logindata = {
      email:user.email,
      password:user.password || null,
      googleId:user.sub || null,
    }
    
    return this.http.post<User>(this.apiurl + '/auth/login', logindata).pipe(
      tap((res:any) => {
        this.loggeduser = res.data;
         console.log('Backend Response saved in Service:', this.loggeduser);
      })
    )
  }

}
