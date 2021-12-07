import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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

  login(): void {
    this.loginService.login(this.firstName, this.lastName, this.password).subscribe({
      next: res => {
        if (res.body && res.body.token) {
          // Set the token of the user
          this.loginService.setToken(res.body.token);
        }
        // Navigate to main page after log in successfully
        this.router.navigate(['/']);
      },
      error: err => {
        if (err.status === 401) { // Incorrect username or password
          this.errorMassage = err.error;
        } else {
          this.errorMassage = 'Network or internal error, please try again';
        }
        // If log in failed, clear the saved username and token
        this.loginService.logout();
      }
    });
  }

}
