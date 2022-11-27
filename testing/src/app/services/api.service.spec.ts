import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in successfully', () => {
    const username = 'admin';
    const password = 'admin';

    service.login(username, password).subscribe({
      next: (response) => {
        expect(response.result).toEqual(true);
        expect(response.token).toBeTruthy();
      },
      error: (error) => {
        fail('wrong username and password');
      },
    });

    const req = httpController.expectOne('http://localhost:3000/login');
    expect(req.request.method).toEqual('POST');
    req.flush(
      {
        result: true,
        token: '123456789',
      },
      { status: 200, statusText: 'ok' }
    );
  });
  it('should fail login', () => {
    const username = 'admin';
    const password = 'admin1';

    service.login(username, password).subscribe({
      next: (response) => {
        fail('wrong username and password');
      },
      error: (error) => {
        expect(error.status).toEqual(403);
      },
    });

    const req = httpController.expectOne('http://localhost:3000/login');
    expect(req.request.method).toEqual('POST');
    req.flush('wrongLogin', { status: 403, statusText: 'wrongLogin' });
  });

  it('should get users list', () => {
    service.getUsers().subscribe({
      next: (response) => {
        expect(response.result).toBeTrue();
        expect(response.users).toBeTruthy();
        response.users.forEach((el) => {
          const keys = Object.keys(el);
          expect(keys.length).toEqual(4);
          expect(keys).toEqual(
            jasmine.arrayContaining([
              'firstName',
              'lastName',
              'email',
              'avatar',
            ])
          );
        });
      },
      error: (error) => fail('Call did not return anything'),
    });

    const req = httpController.expectOne('http://localhost:3000/users');
    expect(req.request.method).toEqual('GET');
    req.flush({
      result: true,
      users: [
        {
          firstName: 'Marco',
          lastName: 'Agostino',
          email: 'm.agostino@esis-italia.com',
          avatar: 'http://via.placeholder.com/150',
        },
      ],
    });
  });

  it('should get error when retrieving users list', () => {
    service.getUsers().subscribe({
      next: (response) => {
        fail('Call should give an error');
      },
      error: (error) => {
        expect(error).toBeDefined();
        expect(error.status).toEqual(500);
      },
    });

    const req = httpController.expectOne('http://localhost:3000/users');
    expect(req.request.method).toEqual('GET');
    req.flush('errore', {
      error: 'Errore',
      ok: false,
      message: 'Errore',
      status: 500,
      statusText: 'errore finto',
    } as HttpErrorResponse);
  });
});
