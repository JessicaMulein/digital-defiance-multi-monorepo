import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  loading!: boolean;

  constructor(
    private router: Router,
    private titleService: Title,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Duality Social - Login');
    this.authenticationService.logout();
    this.createForm();
  }

  private createForm() {
    const savedUserEmail = localStorage.getItem('savedUserEmail');

    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(savedUserEmail, [
        Validators.required,
        Validators.email,
      ]),
      password: new UntypedFormControl('', Validators.required),
      rememberMe: new UntypedFormControl(savedUserEmail !== null),
    });
  }

  login() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    const rememberMe = this.loginForm.get('rememberMe')?.value;

    this.loading = true;
    this.authenticationService.login().subscribe(
      (data) => {
        if (rememberMe) {
          localStorage.setItem('savedUserEmail', email);
        } else {
          localStorage.removeItem('savedUserEmail');
        }
        this.createUserInDB();
        this.router.navigate(['/']);
      },
      (error) => {
        this.notificationService.openSnackBar(error.error);
        this.loading = false;
      }
    );
  }

  /**
   * TODO: call me
   * @param account
   */
  public createUserInDB() {
    const account = this.authenticationService.getCurrentUser();
    if (!account) {
      return;
    }
    console.log('account', account);
    const userData = {
      id: account.homeAccountId,
      username: account.username,
      email: account.nativeAccountId,
    };
    console.log('userData', userData);

    this.authenticationService.getAccessToken().subscribe((accessToken) => {
      console.log('accessToken', accessToken);
      if (accessToken) {
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        this.http
          .post(`${environment.domainName}/api/users`, userData, { headers })
          .subscribe(
            (response) => console.log('User created in MongoDB:', response),
            (error) => console.error('Error creating user in MongoDB:', error)
          );
      }
    });
  }

  resetPassword() {
    this.router.navigate(['/auth/password-reset-request']);
  }
}