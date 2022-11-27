import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

import { UsersComponent } from './users.component';

const testErrorResponse = {
  status: 500,
  statusMessage: 'errore',
};
const testSuccessResponse: { result: boolean; users: User[] } = {
  result: true,
  users: [
    {
      firstName: 'Marco',
      lastName: 'Agostino',
      email: 'm.agostino@esis-italia.com',
      avatar: 'https://via.placeholder.com/150',
    },
  ],
};

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  let serviceSpy: {
    getUsers: jasmine.Spy;
  };
  let service: ApiService;
  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj(ApiService, ['getUsers']);
    TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [],
      providers: [{ provide: ApiService, useValue: serviceSpy }],
    }).compileComponents();
    service = TestBed.inject(ApiService);
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    serviceSpy.getUsers.and.returnValue(of(testSuccessResponse));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should retrieve users', fakeAsync(() => {
    serviceSpy.getUsers.and.returnValue(of(testSuccessResponse));
    fixture.detectChanges();

    tick();

    // assert
    expect(serviceSpy.getUsers).toHaveBeenCalled();
    expect(
      fixture.nativeElement.querySelectorAll('LI').length
    ).toBeGreaterThanOrEqual(1);
  }));
  it('should error retrieving users', fakeAsync(() => {
    serviceSpy.getUsers.and.returnValue(throwError(() => testErrorResponse));
    fixture.detectChanges();

    tick();

    // assert
    expect(serviceSpy.getUsers).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('LI').length).toEqual(0);
  }));
});
