import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]> = of([]);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.users$ = this.api.getUsers().pipe(
      map((res) => res.users),
      catchError((error) => of([]))
    );
  }
}
