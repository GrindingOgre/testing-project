import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

import { LoginComponent } from './login.component';
class Page {
  get submitButton() {
    return this.fixture.nativeElement.querySelector('button[type="submit"]');
  }
  get usernameInput() {
    return this.fixture.debugElement.nativeElement.querySelector('#username');
  }
  get passwordInput() {
    return this.fixture.debugElement.nativeElement.querySelector('#password');
  }
  get errorMsg() {
    return this.fixture.debugElement.nativeElement.querySelector('#error');
  }

  constructor(private fixture: ComponentFixture<LoginComponent>) {}

  public updateValue(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('change'));
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let service: ApiService;
  let serviceSpy: {
    login: jasmine.Spy;
  };
  let router: Router;
  let routerSpy: {
    navigate: jasmine.Spy;
  };
  let page: Page;
  let debugEl: DebugElement;
  beforeEach(() => {
    routerSpy = jasmine.createSpyObj(Router, ['navigate']);
    serviceSpy = jasmine.createSpyObj(ApiService, ['login']);
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: ApiService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    page = new Page(fixture);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    service = TestBed.inject(ApiService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empty username', () => {
    expect(component.username).toBe('');
    page.submitButton.click();
    fixture.detectChanges();
    expect(component.error).toBe('Inserire username');
    expect(page.errorMsg.textContent).toBe(component.error);
  });
  it('empty password', async () => {
    component.username = 'admin';
    await fixture.whenStable();
    expect(component.username).toBe('admin');
    expect(component.password).toBe('');
    page.submitButton.click();
    fixture.detectChanges();
    expect(component.error).toBe('Inserire password');
    expect(page.errorMsg.textContent).toBe(component.error);
  });
  it('Valid credentials', waitForAsync(() => {
    component.username = 'admin';
    component.password = 'admin';
    (service.login as jasmine.Spy).and.returnValue(
      of({ result: true, token: '12345678' })
    );
    page.submitButton.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errorArea = debugEl.query(By.css('#error'));
      expect(errorArea).toBeNull();
      const navArgs = (router.navigate as jasmine.Spy).calls.first().args[0];
      expect(navArgs).toEqual(['/users']);
    });
  }));
  it('Invalid credentials', fakeAsync(() => {
    component.username = 'admin';
    component.password = 'admin1';
    (service.login as jasmine.Spy).and.returnValue(
      throwError(() => ({
        status: 403,
        statusMessage: 'forbidden',
        error: {
          error: 'Login errata',
        },
      }))
    );
    page.submitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.error).toBe('Login errata');
    expect(page.errorMsg.textContent).toBe(component.error);
  }));
  it('Login Error', fakeAsync(() => {
    component.username = 'admin';
    component.password = 'admin';
    (service.login as jasmine.Spy).and.returnValue(
      throwError(() => 'Login errata')
    );
    page.submitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.error).toBe('Login errata');
    expect(page.errorMsg.textContent).toBe(component.error);
  }));
});
