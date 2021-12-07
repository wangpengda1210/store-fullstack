import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  username: string | null = localStorage.getItem('username');
  token: string | null = localStorage.getItem('token');
  updateHeader: EventEmitter<void> = new EventEmitter;

  constructor(private httpClient: HttpClient) { }

  login(firstName: String, lastName: String, password: String): Observable<HttpResponse<{
    token: string
  }>> {
    // Save the username
    localStorage.setItem('username', `${firstName} ${lastName}`);
    return this.httpClient.post<{
      token: string
    }>('http://localhost:3000/users/login', {
      first_name: firstName,
      last_name: lastName,
      password: password
    }, { observe: "response" });
  }

  setToken(token: string): void {
    // Save the token
    localStorage.setItem('token', token);
    this.token = token;
    // Tell the header to update the displayed username
    this.updateHeader.emit();
  }

  logout(): void {
    // Clear the saved token and username
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.username = null;
    this.token = null;
  }

  getHeader(): HttpHeaders {
    // The header to access endpoints that requires authorization
    return new HttpHeaders().set("Authorization", `Bearer ${this.token}`);
  }

  isLoggedIn(): boolean {
    console.log(this.token);
    return this.token != null;
  }

  register(firstName: String, lastName: String, password: String): Observable<HttpResponse<void>> {
    return this.httpClient.post<void>('http://localhost:3000/users', {
      first_name: firstName,
      last_name: lastName,
      password: password
    }, { observe: "response" });
  }
}
