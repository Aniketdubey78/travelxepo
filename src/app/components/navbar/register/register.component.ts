import { Component } from '@angular/core';
import { CustomerserviceService } from '../../../services/customerservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
constructor(private customerservice: CustomerserviceService,private router:Router) {}

username: string = '';
email: string = '';
age: number = 0;
gender: string = '';
password: string = '';

signup(){
  const registerdata = {
    username: this.username,
    email: this.email,
    password: this.password,
    age: this.age,
    gender: this.gender
  }
  this.customerservice.register(registerdata).subscribe({
    next:(response)=>{
      console.log(response);
      this.router.navigate(['/login']);
    }
  })
   
   
  
}
navigateToLogin(){
  this.router.navigate(['/login']);
}
}

