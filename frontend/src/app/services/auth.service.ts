import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(private apollo: Apollo) {}

  login(email: string, password: string) {
    const LOGIN_QUERY = gql`
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;

    return this.apollo
      .watchQuery<any>({
        query: LOGIN_QUERY,
        variables: { email, password },
        fetchPolicy: 'no-cache'
      })
      .valueChanges.pipe(
        map((result) => {
          const token = result?.data?.login;
          if (token) {
            localStorage.setItem(this.tokenKey, token);
          }
          return token;
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
