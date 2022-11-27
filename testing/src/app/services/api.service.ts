import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  login(username: string, password: string) {
    return this.http.post<{ result: boolean; token: string }>(
      'http://localhost:3000/login',
      {
        username,
        password,
      }
    );
  }
  getUsers() {
    return this.http.get<{ result: boolean; users: User[] }>(
      'http://localhost:3000/users'
    );
  }
}
