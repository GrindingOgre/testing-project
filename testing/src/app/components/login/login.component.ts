import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {}

  doLogin() {
    this.error = '';
    if (this.username && this.password) {
      this.api.login(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.error = 'Login errata';
        },
      });
    }
    if (!this.username) {
      this.error = 'Inserire username';
      return;
    }
    if (!this.password) {
      this.error = 'Inserire password';
      return;
    }
  }
}
