import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PublicClientApplication,
  AuthenticationResult,
  AccountInfo,
} from '@azure/msal-browser';
import { Observable, from, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface User extends AccountInfo {
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private msalClient: PublicClientApplication;

  constructor(private http: HttpClient) {
    this.msalClient = new PublicClientApplication({
      auth: {
        clientId: environment.msal.clientId,
        authority: environment.msal.authority,
        redirectUri: environment.msal.redirectUri,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
      },
    });
  }

  login(): Observable<boolean> {
    return from(
      this.msalClient.loginPopup({
        scopes: ['openid', 'profile', 'email'],
      })
    ).pipe(
      map((result: AuthenticationResult) => {
        if (result) {
          this.msalClient.setActiveAccount(result.account);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  logout(): Observable<void> {
    return from(this.msalClient.logout()).pipe(map(() => {}));
  }

  passwordReset(
    email: string,
    token: string,
    password: string,
    confirmPassword: string
  ): any {
    // TODO implement on backend
    return of(true).pipe(delay(1000));
  }

  passwordResetRequest(email: string) {
    // TODO implement on backend // deduplicate from above?
    return this.http.post(
      `${environment.domainName}/api/password-reset/request`,
      { email }
    );
  }

  getAccessToken(): Observable<string> {
    return from(
      this.msalClient.acquireTokenSilent({
        scopes: ['openid', 'profile', 'email', `api://${environment.msal.clientId}`],
      })
    ).pipe(map((result: AuthenticationResult) => result.accessToken));
  }

  getCurrentUser(): User | null {
    const account = this.msalClient.getActiveAccount();
    const x: User = account as User;
    x.isAdmin = false;
    return account ? x : null;
  }
}
