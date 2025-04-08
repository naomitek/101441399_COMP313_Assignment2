import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;

    const { email, password } = this.loginForm.value;

    const LOGIN_MUTATION = gql`
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;

    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
      fetchPolicy: 'no-cache'
    }).subscribe({
      next: (result: any) => {
        const token = result.data.login;
        localStorage.setItem('token', token);
        this.router.navigate(['/employees']);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}
