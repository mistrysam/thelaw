import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Login } from 'app/models/login';
import { LoginService } from 'app/modules/non-auth/login/login.service';
import { AuthService } from 'app/shared/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  model: Login = new Login();
  error: string;
  isLoading: boolean;

  constructor(private router: Router, private loginService: LoginService, private authService: AuthService) {
    this.isLoading = false;
  }

  ngOnInit() {
  }

  login() {
    this.isLoading = true;
    this.loginService.login(this.model).subscribe(res => {
      this.isLoading = false;
      if (res) {
        const tenent = this.authService.getTenent();
        this.router.navigateByUrl(`/${tenent}`);
      } else {
        this.error = 'Incorrect username/password';
      }
    }, err => {
      this.isLoading = false;
      if (err.status === 400) {
        this.error = err.error.ErrorMessage[1];
      }
    });

  }
}
