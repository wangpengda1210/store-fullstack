import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  errorMassage: String = '';


  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    // Redirect to the main page is the user is already logged in
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  register(): void {
    this.loginService.register(this.firstName, this.lastName, this.password).subscribe({
      next: () => {
        window.alert('Register success');
        // Redirect to log in page after successful registration
        this.router.navigate(['/login']);
      },
      error: err => {
        // User already exists
        console.log(err)
        if (err.error && err.error.error) {
          if (err.error.error.indexOf('unique_username') != -1) {
            this.errorMassage = `User with first name ${this.firstName} and last name ${this.lastName} exists.`;
          } else {
            this.errorMassage = err.error.error;
          }
        } else {
          this.errorMassage = 'Network or internal error, please try again';
        }
      }
    })
  }

}
