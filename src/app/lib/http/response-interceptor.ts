import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from 'app/shared/services/auth.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';


@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  isRefreshingToken: boolean;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService, private router: Router) {
    this.isRefreshingToken = false;
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token) {
      return req.clone({ setHeaders: { Authorization: 'Basic ' + token } });
    } else {
      return req;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(req, this.authService.getAuthToken())).map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
        return event;
      }
    }).catch((err: any) => {
      if (err instanceof HttpErrorResponse) {
        switch ((<HttpErrorResponse>err).status) {
          case 400:
            return this.handle400Error(err);
          case 401:
            this.logoutUser();
            return Observable.throw(err.error);
          case 404:
            return this.router.navigateByUrl('/');
          case 500:
            return Observable.throw(err.error);
          default:
            return Observable.throw(err);
        }
      } else {
      }
    });
  }

  handle400Error(error) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.logoutUser();
    }
    return Observable.throw(error);
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    this.authService.setAuhToken('');
    this.router.navigate([`/${this.authService.getTenent()}/login`]);
    return Observable.throw('');
  }
}
