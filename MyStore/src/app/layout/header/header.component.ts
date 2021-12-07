import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../services/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  // The username displays in the header
  username: string | null = this.loginService.username;

  ngOnInit(): void {
    // When updateHeader is emitted, update the current username
    this.loginService.updateHeader.subscribe(() => {
      this.username = localStorage.getItem('username');
    });
  }

  logout(): void {
    this.loginService.logout();
    this.username = null;
  }
}
