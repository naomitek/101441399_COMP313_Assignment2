import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.loading = true;

    const { username, email, password } = this.signupForm.value;

    const SIGNUP_MUTATION = gql`
      mutation signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password)
      }
    `;

    this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password },
      fetchPolicy: 'no-cache'
    }).subscribe({
      next: (result: any) => {
        const token = result.data.signup;
        localStorage.setItem('token', token); // saving token
        this.successMessage = 'User created and logged in! Redirecting...';
        this.errorMessage = '';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/employees']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Signup failed.';
        this.loading = false;
      }
    });
  }
}
